import { Sidebar } from "@/components/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { Pricing } from "@/components/Pricing";
import LocationUpdater from "@/components/LocationUpdater";
import { UserButton } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const planName = (user?.publicMetadata?.planName as string) || 'Free Plan';

  if (planName === 'Free Plan') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] relative">
         <LocationUpdater />
         <div className="absolute top-6 right-6 z-50">
            <UserButton afterSignOutUrl="/" />
         </div>
         <Pricing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LocationUpdater />
      <Sidebar />
      <main className="lg:pl-64 min-h-screen pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

