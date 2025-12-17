import { Sidebar } from "@/components/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { Pricing } from "@/components/Pricing";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';

  if (planName === 'Free Plan') {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
         <Pricing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

