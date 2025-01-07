import { Footer } from "@/components/homepage/footer";
import HeroHomepage from "@/components/homepage/hero-homepage";
import { Navbar } from "@/components/homepage/navbar";
import ShowcaseGrid from "@/components/homepage/showcase-grid";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Fondo estático */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Contenido principal */}
      <Navbar />
      <UserButton />
      <main className="flex w-full flex-1 flex-col items-center justify-center">
        <HeroHomepage />
        <ShowcaseGrid />
      </main>
      <Footer />
    </div>
  );
}
