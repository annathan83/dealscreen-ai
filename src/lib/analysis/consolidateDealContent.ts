import { DealInput, DealFile } from "@/lib/types";

export function consolidateDealContent(
  inputs: DealInput[],
  files: DealFile[]
): string {
  const parts: string[] = [];

  if (inputs.length) {
    parts.push("=== TEXT INPUTS ===");
    for (const input of inputs) {
      parts.push(
        `--- ${input.input_type.toUpperCase()} | ${input.title ?? "Untitled"} ---`,
        input.content.trim(),
        ""
      );
    }
  }

  if (files.length) {
    parts.push("=== FILES (METADATA ONLY IN V1) ===");
    for (const file of files) {
      parts.push(
        `File: ${file.file_name}`,
        `Mime: ${file.mime_type ?? "unknown"}`,
        file.external_url ? `URL: ${file.external_url}` : "",
        ""
      );
    }
  }

  if (!parts.length) {
    parts.push(
      "No inputs or files are attached to this deal yet. Focus on identifying what information is missing."
    );
  }

  return parts.join("\n");
}

