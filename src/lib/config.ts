export type AppEnv = "development" | "staging" | "production";

export const env = {
  NODE_ENV: (process.env.NODE_ENV ?? "development") as "development" | "test" | "production",
  /** Set in deployment (e.g. Vercel) to distinguish staging vs production */
  APP_ENV: (process.env.APP_ENV ?? process.env.NODE_ENV ?? "development") as AppEnv,
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  GOOGLE_SERVICE_ACCOUNT_EMAIL:
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "",
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: (process.env
    .GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? ""
  ).replace(/\\n/g, "\n"),
  GOOGLE_DRIVE_ROOT_FOLDER_ID:
    process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ?? "",
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
  GOOGLE_OAUTH_REDIRECT_URI:
    process.env.GOOGLE_OAUTH_REDIRECT_URI ??
    "http://localhost:3000/api/drive/oauth-callback",
  DEALHUB_OPENAI_MODEL:
    process.env.DEALHUB_OPENAI_MODEL ?? "gpt-4.1-mini" // adjust as needed
};

export const appConfig = {
  appName: "DealHub AI",
  appDescription:
    "A structured workspace for acquisition deals with AI-assisted first-pass analysis.",
  /** Replace with your support/privacy contact for production and Play Store */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com",
  /** Optional: your company or developer name for policies */
  developerName: process.env.NEXT_PUBLIC_DEVELOPER_NAME ?? "DealHub AI"
};

