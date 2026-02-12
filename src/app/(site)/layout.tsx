import { HomeLayout } from "fumadocs-ui/layouts/home";

import { SiteFooter } from "@/components/site-footer";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
      <SiteFooter />
    </div>
  );
}
