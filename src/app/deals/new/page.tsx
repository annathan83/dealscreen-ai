import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { nextDealCodeFromExisting } from "@/lib/dealCode";
import { createDealFolderTree } from "@/lib/googleDrive";
import {
  createDealFolderTreeForUser,
  ensureUserWorkspaceRootFolder
} from "@/lib/googleDriveUser";
import { insertChangelog } from "@/lib/changelog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateDealSubmitButton } from "@/components/deals/CreateDealSubmitButton";

const createDealSchema = z.object({
  title: z.string().trim().optional(),
  business_name: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  location: z.string().trim().optional(),
  source: z.string().trim().optional(),
  initial_text: z.string().trim().optional()
});

async function createDeal(formData: FormData) {
  "use server";

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const raw = {
    title: formData.get("title")?.toString() ?? "",
    business_name: formData.get("business_name")?.toString() ?? "",
    industry: formData.get("industry")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    source: formData.get("source")?.toString() ?? "",
    initial_text: formData.get("initial_text")?.toString() ?? ""
  };

  const parsed = createDealSchema.parse(raw);

  const { data: existingDeals, error: codeError } = await supabase
    .from("deals")
    .select("deal_code")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(500);

  if (codeError) {
    console.error(codeError);
  }

  const existingCodes = (existingDeals ?? []).map((r) => r.deal_code);
  const nextCode = nextDealCodeFromExisting(existingCodes);

  let drive_folder_id: string | null = null;
  let drive_folder_url: string | null = null;

  try {
    const { data: driveSettings } = await supabase
      .from("user_drive_settings")
      .select("drive_refresh_token, root_folder_id, root_folder_name, root_folder_url")
      .eq("user_id", user.id)
      .maybeSingle();

    if (driveSettings?.drive_refresh_token) {
      let rootId = driveSettings.root_folder_id;
      if (!rootId) {
        const { id } = await ensureUserWorkspaceRootFolder(
          driveSettings.drive_refresh_token
        );
        rootId = id;
        await supabase
          .from("user_drive_settings")
          .update({
            root_folder_id: id,
            root_folder_name: "DealHub AI",
            root_folder_url: `https://drive.google.com/drive/folders/${id}`,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
      }
      const drive = await createDealFolderTreeForUser(
        driveSettings.drive_refresh_token,
        rootId,
        nextCode,
        parsed.business_name || parsed.title
      );
      drive_folder_id = drive.id;
      drive_folder_url = drive.url;
    } else {
      const drive = await createDealFolderTree(
        nextCode,
        parsed.business_name || parsed.title
      );
      drive_folder_id = drive.id;
      drive_folder_url = drive.url;
    }
  } catch (err) {
    console.error("Drive folder creation failed", err);
  }

  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      user_id: user.id,
      deal_code: nextCode,
      title: parsed.title || null,
      business_name: parsed.business_name || null,
      industry: parsed.industry || null,
      location: parsed.location || null,
      source: parsed.source || null,
      status: "new",
      drive_folder_id,
      drive_folder_url
    })
    .select("*")
    .single();

  if (error || !deal) {
    console.error("Deal insert error", error);
    const message = error?.message ?? "Failed to create deal";
    throw new Error(typeof message === "string" ? message : "Failed to create deal");
  }

  await insertChangelog(supabase, {
    user_id: user.id,
    deal_id: deal.id,
    action: "deal_created",
    details: { deal_code: nextCode, title: parsed.title ?? null, business_name: parsed.business_name ?? null }
  });

  if (parsed.initial_text) {
    const { error: inputError } = await supabase.from("deal_inputs").insert({
      deal_id: deal.id,
      user_id: user.id,
      input_type: "listing_text",
      title: "Initial text",
      content: parsed.initial_text
    });

    if (inputError) {
      console.error("Failed to create initial input", inputError);
    }
  }

  redirect(`/deals/${deal.id}`);
}

export default function NewDealPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="page-header">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            Create deal workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Capture the basics, paste initial listing text, and let DealHub AI
            scaffold the workspace and Drive folder.
          </p>
        </div>
      </div>

      <form action={createDeal} className="card space-y-5 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Deal title
            </label>
            <Input
              name="title"
              placeholder="Short handle for this deal"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Business name
            </label>
            <Input
              name="business_name"
              placeholder="If known from the listing"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Industry
              </label>
              <Input
                name="industry"
                placeholder="e.g. Home services, SaaS"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>
              <Input
                name="location"
                placeholder="City / state / region"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Source
            </label>
            <Input
              name="source"
              placeholder="e.g. BizBuySell, broker name, proprietary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Optional initial text
          </label>
          <Textarea
            name="initial_text"
            placeholder="Paste listing text, teaser, or broker email. DealHub AI will use this as the first input."
            rows={8}
          />
        </div>

        <div className="flex justify-end">
          <CreateDealSubmitButton />
        </div>
      </form>
    </div>
  );
}

