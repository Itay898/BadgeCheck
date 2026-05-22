"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { SiteLogo } from "@/components/site/SiteLogo";
import { components, tools } from "@/lib/tambo";
import { useAnonymousUserKey } from "@/lib/use-anonymous-user-key";
import { TamboProvider } from "@tambo-ai/react";

export default function ChatPage() {
  const mcpServers = useMcpServers();
  const userKey = useAnonymousUserKey();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      userKey={userKey}
    >
      <div className="flex h-screen flex-col">
        {/* Slim top bar — gives chat users a clear way back to the site */}
        <header className="shrink-0 border-b border-border bg-background">
          <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-4 px-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={16} aria-hidden />
              חזרה לאתר
            </Link>
            <Link href="/" className="rounded-md transition-opacity hover:opacity-90">
              <SiteLogo />
            </Link>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <MessageThreadFull className="max-w-2xl mx-auto" />
        </div>
      </div>
    </TamboProvider>
  );
}
