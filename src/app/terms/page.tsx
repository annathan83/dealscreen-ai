import Link from "next/link";
import { appConfig } from "@/lib/config";

export const metadata = {
  title: `Terms of Service | ${appConfig.appName}`,
  description: "Terms of service for DealHub AI"
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US")}
      </p>
      <div className="prose prose-sm mt-6 text-foreground">
        <p>
          By using {appConfig.appName}, you agree to use the service in
          accordance with these terms.
        </p>
        <ul className="mt-4 list-disc pl-6 space-y-1">
          <li>
            You are responsible for the accuracy of information you enter and
            for keeping your account credentials secure.
          </li>
          <li>
            AI-generated analysis is for first-pass assessment only and does
            not constitute legal, financial, or due-diligence advice.
          </li>
          <li>
            We may update these terms; continued use after changes constitutes
            acceptance.
          </li>
        </ul>
        <p className="mt-4">
          Our{" "}
          <Link href="/privacy" className="text-primary underline hover:opacity-90">
            Privacy Policy
          </Link>{" "}
          describes how we handle your data.
        </p>
        <p className="mt-4">
          <strong>Contact:</strong> For questions about these terms, email{" "}
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
