import { Feature } from "./_components/Fetaure";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Pricing } from "./_components/Pricing";
import { Stack } from "./_components/Stack";

export default function Page() {
  return (
    <div>
      <div className="bg-white">
        <Header />

        <Hero />
      </div>
      <Stack/>
      {/* Pricing */}
      <Pricing />
      <Feature />
      {/* 页脚 */}
      <Footer />
    </div>
  );
}
