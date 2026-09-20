import { Hero } from "@/components/Hero";
import { SiteNav } from "@/components/SiteNav";
import { CommunityOrbit } from "@/components/CommunityOrbit";
import { Devices, Economics, Features, HowItWorks, MigrateStrip, SiteFooter } from "@/components/Landing";

export default function HomePage() {
  return (
    <main className="bg-void">
      <SiteNav />
      <Hero />
      <div className="landing-flow">
        <Devices />
        <CommunityOrbit />
        <Features />
        <HowItWorks />
        <MigrateStrip />
        <Economics />
        <SiteFooter />
      </div>
    </main>
  );
}
