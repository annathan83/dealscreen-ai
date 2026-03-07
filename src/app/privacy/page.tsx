import Link from "next/link";
import { appConfig } from "@/lib/config";

export const metadata = {
  title: `Privacy Policy | ${appConfig.appName}`,
  description: "Privacy policy for DealHub AI"
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US")}
      </p>
      <div className="prose prose-sm mt-6 text-foreground">
        <p>
          {appConfig.appName} ({appConfig.appDescription}) is designed with
          minimal data access.
        </p>
        <ul className="mt-4 list-disc pl-6 space-y-1">
          <li>
            <strong>Account data:</strong> We store your email and account
            information necessary to provide the service (Supabase Auth).
          </li>
          <li>
            <strong>Deal data:</strong> Deal titles, notes, and analysis
            results are stored in our database and are only visible to you.
          </li>
          <li>
            <strong>Google Drive:</strong> We request the minimum scope (
            <code>drive.file</code>) so we can only create and access folders
            created by the app. We do not read, scan, or access your other
            Drive files.
          </li>
          <li>
            <strong>We do not sell or share your data</strong> with third
            parties for marketing.
          </li>
        </ul>
        <p className="mt-4">
          <strong>Data deletion:</strong> To revoke Google Drive access, use
          Disconnect in Settings. To request deletion of your account and all
          deal data, contact us at the email below.
        </p>
        <p className="mt-2">
          <strong>Security:</strong> Data is encrypted in transit (HTTPS). We
          do not sell or share your data for marketing.
        </p>
        <p className="mt-2">
          <strong>Children:</strong> {appConfig.appName} is not directed at
          users under 13. We do not knowingly collect data from children.
        </p>
        <p className="mt-4">
          <strong>Contact:</strong> For privacy questions or data deletion
          requests, email{" "}
          <a
            href={`mailto:${appConfig.supportEmail}`}
            className="text-primary underline hover:opacity-90"
          >
            {appConfig.supportEmail}
          </a>
          .
        </p>
      </div>
      <p className="mt-8">
        <Link href="/" className="text-primary underline hover:opacity-90">
          ← Back
        </Link>
      </p>
    </div>
  );
}
