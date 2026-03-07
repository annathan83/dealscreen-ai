import { google } from "googleapis";
import { env } from "@/lib/config";

const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"];

function getDriveClient() {
  if (
    !env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  ) {
    throw new Error("Google Drive service account env vars are not configured.");
  }

  const auth = new google.auth.JWT(
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    DRIVE_SCOPES
  );

  return google.drive({ version: "v3", auth });
}

export interface DriveFolderResult {
  id: string;
  url: string;
  subfolders: { name: string; id: string }[];
}

const STANDARD_SUBFOLDERS = [
  "01 Notes",
  "02 Files",
  "03 Analysis",
  "04 DD"
];

export async function createDealFolderTree(
  dealCode: string,
  businessName?: string | null
): Promise<DriveFolderResult> {
  const drive = getDriveClient();

  const baseName = businessName?.trim() || "Untitled Deal";
  const folderName = `${dealCode} ${baseName}`;

  const rootParentId = env.GOOGLE_DRIVE_ROOT_FOLDER_ID || undefined;

  const { data: rootFolder } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: rootParentId ? [rootParentId] : undefined
    },
    fields: "id"
  });

  if (!rootFolder.id) {
    throw new Error("Failed to create Drive folder");
  }

  const subfolderResults = await Promise.all(
    STANDARD_SUBFOLDERS.map((name) =>
      drive.files.create({
        requestBody: {
          name,
          mimeType: "application/vnd.google-apps.folder",
          parents: [rootFolder.id]
        },
        fields: "id"
      })
    )
  );

  const subfolders: { name: string; id: string }[] = STANDARD_SUBFOLDERS.map(
    (name, i) => ({
      name,
      id: subfolderResults[i].data.id ?? ""
    })
  ).filter((s) => s.id);

  const url = `https://drive.google.com/drive/folders/${rootFolder.id}`;

  return {
    id: rootFolder.id,
    url,
    subfolders
  };
}

