"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GenerateButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="text-lg font-semibold"
      size="lg"
      onClick={() => {
        setLoading(true);
        window.location.reload();
      }}
      loading={loading}
    >
      Generate New Content 🚀
    </Button>
  );
}
