"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/content";

const HeroSlider3D = dynamic(() => import("@/components/three/HeroSlider3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] md:h-[480px] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light noise">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[80px] animate-float-slow" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold glass text-accent mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Canada &bull; Afrique &bull; Haïti
            </motion.span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                {siteConfig.name}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="block text-gradient mt-2 text-2xl md:text-3xl font-medium"
              >
                {siteConfig.tagline}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Votre partenaire de confiance pour l&apos;éducation financière, les assurances,
              les déclarations d&apos;impôts et le recrutement international.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-4"
            >
              <Button href="/contact" variant="accent" size="lg">
                Nous contacter
              </Button>
              <Button href="/services" variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                Découvrir nos services
              </Button>
            </motion.div>

            {/* Quick stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { value: "5000+", label: "Clients" },
                { value: "3", label: "Continents" },
                { value: "98%", label: "Satisfaction" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-white/40 text-sm mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HeroSlider3D />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <motion.div
            animate={{ height: [6, 14, 6], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1 bg-accent/70 rounded-full"
          />
        </motion.div>
        <p className="text-white/30 text-[10px] text-center mt-2 tracking-widest uppercase">Scroll</p>
      </motion.div>
    </section>
  );
}
