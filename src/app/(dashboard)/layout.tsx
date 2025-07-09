"use client";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import {
  SidebarProvider,
 
} from "@/components/ui/sidebar";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
