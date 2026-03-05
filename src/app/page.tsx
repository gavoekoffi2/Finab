import HeroSection from "@/components/home/HeroSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import GallerySection from "@/components/home/GallerySection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsSection from "@/components/home/NewsSection";
import QuizSection from "@/components/home/QuizSection";
import WhyUsSection from "@/components/home/WhyUsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <StatsSection />
      <ProductsPreview />
      <GallerySection />
      <QuizSection />
      <TestimonialsSection />
      <NewsSection />
      <WhyUsSection />
    </>
  );
}
