"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React from "react";

let queryClientSingleton: QueryClient | null = null;

function getQueryClient(): QueryClient {
  if (!queryClientSingleton) {
    queryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 30,
          refetchOnWindowFocus: false,
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }
  return queryClientSingleton;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const client = React.useState(() => getQueryClient())[0];
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
