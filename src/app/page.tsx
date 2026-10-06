import HeroSearchSection from "@/components/home/HeroSearchSection";
import TopRankingGrid from "@/components/home/TopRankingGrid";
import OutcodeDirectory from "@/components/home/OutcodeDirectory";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* 1. Hero Search Section */}
      <HeroSearchSection />

      {/* 2. Top Damp Risk Rankings */}
      <TopRankingGrid />

      {/* 3. Complete UK Outcode Directory */}
      <OutcodeDirectory />
    </main>
  );
}