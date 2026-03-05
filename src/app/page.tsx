import HeroSection from "@/components/home/HeroSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsSection from "@/components/home/NewsSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import QuizSection from "@/components/home/QuizSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <ProductsPreview />
      <QuizSection />
      <TestimonialsSection />
      <NewsSection />
      <WhyUsSection />
    </>
  );
}
