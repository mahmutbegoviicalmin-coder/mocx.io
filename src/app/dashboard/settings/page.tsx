import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-8 flex justify-center">
      <UserProfile 
        appearance={{
          baseTheme: dark,
          elements: {
            card: "bg-card border border-border shadow-none",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
          }
        }}
      />
    </div>
  );
}

