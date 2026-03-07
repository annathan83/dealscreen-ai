import { google } from "googleapis";
import { env } from "@/lib/config";

// Minimal scope: app can only create and access files/folders it creates.
// No access to list or read the rest of the user's Drive.
const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"];

export function getUserOAuthClient() {
  if (
    !env.GOOGLE_OAUTH_CLIENT_ID ||
    !env.GOOGLE_OAUTH_CLIENT_SECRET ||
    !env.GOOGLE_OAUTH_REDIRECT_URI
  ) {
    throw new Error("Google OAuth env vars are not configured.");
  }

  return new google.auth.OAuth2(
    env.GOOGLE_OAUTH_CLIENT_ID,
    env.GOOGLE_OAUTH_CLIENT_SECRET,
    env.GOOGLE_OAUTH_REDIRECT_URI
  );
}

export function getUserDriveAuthUrl(state: string) {
  const client = getUserOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: DRIVE_SCOPES,
    state
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getUserOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export function getUserDriveClient(refreshToken: string) {
  const client = getUserOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: "v3", auth: client });
}

export interface UserDriveFolderResult {
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

export async function createDealFolderTreeForUser(
  refreshToken: string,
  rootFolderId: string,
  dealCode: string,
  businessName?: string | null
): Promise<UserDriveFolderResult> {
  const drive = getUserDriveClient(refreshToken);

  const baseName = businessName?.trim() || "Untitled Deal";
  const folderName = `${dealCode} ${baseName}`;

  const { data: rootFolder } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [rootFolderId]
    },
    fields: "id"
  });

  if (!rootFolder.id) {
    throw new Error("Failed to create user Drive folder");
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

export async function ensureUserWorkspaceRootFolder(
  refreshToken: string
): Promise<{ id: string; url: string }> {
  const drive = getUserDriveClient(refreshToken);
  const workspaceName = "DealHub AI";

  // With drive.file scope, this will only ever see folders that were
  // created or explicitly opened via this app.
  const { data: existing } = await drive.files.list({
    q: [
      "mimeType = 'application/vnd.google-apps.folder'",
      `name = '${workspaceName}'`,
      "trashed = false"
    ].join(" and "),
    fields: "files(id, name)",
    pageSize: 1,
    spaces: "drive"
  });

  const already =
    existing.files && existing.files.length > 0
      ? existing.files[0]
      : null;

  if (already?.id) {
    return {
      id: already.id,
      url: `https://drive.google.com/drive/folders/${already.id}`
    };
  }

  const { data: root } = await drive.files.create({
    requestBody: {
      name: workspaceName,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["root"]
    },
    fields: "id"
  });

  if (!root.id) {
    throw new Error("Failed to create DealHub AI workspace folder");
  }

  return {
    id: root.id,
    url: `https://drive.google.com/drive/folders/${root.id}`
  };
}

