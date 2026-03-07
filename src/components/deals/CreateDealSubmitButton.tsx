"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function CreateDealSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create workspace"}
    </Button>
  );
}
