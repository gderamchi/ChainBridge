import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PortalSidebar } from "./components/portal-sidebar";
import { Separator } from "@/components/ui/separator";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  return (
    <SidebarProvider>
      <PortalSidebar />
      <SidebarInset className="bg-slate-dark">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1 text-text-muted hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-text-muted">Portal</span>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
