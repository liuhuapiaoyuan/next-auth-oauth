import { Feature } from "./Fetaure";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";

export default function Page() {
  return (
    <div>
      <div className="bg-white">
        <Header />

        <Hero />
      </div>
      {/* Pricing */}
      <Pricing />
      <Feature />
      {/* 页脚 */}
      <Footer />
    </div>
  );
}
