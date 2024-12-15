"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createQueryClient } from "./query-client";
import { NetworkProvider } from "./network";
import "../styles/globals.css";

interface ProvidersProps {
  children: React.ReactNode;
  enablePersistence?: boolean;
}

export function Providers({
  children,
  enablePersistence = false,
}: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient(enablePersistence));

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>{children}</NetworkProvider>
    </QueryClientProvider>
  );
}
