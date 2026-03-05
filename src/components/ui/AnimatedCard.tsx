"use client";

import { motion } from "framer-motion";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

export default function AnimatedCard({
  children,
  delay = 0,
  className = "",
  hover = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -8, boxShadow: "0 0 30px rgba(22,163,74,0.15), 0 25px 50px -12px rgba(0,0,0,0.1)" } : {}}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 card-glow ${className}`}
    >
      {children}
    </motion.div>
  );
}
