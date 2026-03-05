"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";
import { heroSlides } from "@/data/content";

function SlideCard({
  index,
  activeIndex,
  total,
  title,
  subtitle,
  icon,
  color,
  onClick,
}: {
  index: number;
  activeIndex: number;
  total: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const angle = ((index - activeIndex) / total) * Math.PI * 2;
  const radius = 3.5;
  const targetX = Math.sin(angle) * radius;
  const targetZ = Math.cos(angle) * radius - 2;
  const isActive = index === activeIndex;
  const targetScale = isActive ? 1.15 : 0.75;
  const targetOpacity = isActive ? 1 : 0.5;
  const targetY = isActive ? 0.2 : -0.1;

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    const speed = 4 * delta;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, speed);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, speed);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, speed);
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, speed);
    meshRef.current.scale.set(s, s, s);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, -angle * 0.3, speed);
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, speed);
  });

  return (
    <group ref={meshRef} onClick={onClick}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3} enabled={isActive}>
        <RoundedBox args={[3, 1.8, 0.12]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            ref={materialRef}
            color={color}
            transparent
            roughness={0.3}
            metalness={0.1}
          />
        </RoundedBox>
        <Text
          position={[0, 0.4, 0.08]}
          fontSize={0.16}
          maxWidth={2.5}
          textAlign="center"
          color="white"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {icon}
        </Text>
        <Text
          position={[0, 0.05, 0.08]}
          fontSize={0.18}
          maxWidth={2.5}
          textAlign="center"
          color="white"
          anchorY="middle"
          fontWeight={700}
        >
          {title}
        </Text>
        <Text
          position={[0, -0.35, 0.08]}
          fontSize={0.09}
          maxWidth={2.2}
          textAlign="center"
          color="rgba(255,255,255,0.8)"
          anchorY="middle"
          lineHeight={1.4}
        >
          {subtitle}
        </Text>
      </Float>
    </group>
  );
}

function Scene({ activeIndex, setActiveIndex }: { activeIndex: number; setActiveIndex: (i: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#D4A843" />
      {heroSlides.map((slide, i) => (
        <SlideCard
          key={slide.id}
          index={i}
          activeIndex={activeIndex}
          total={heroSlides.length}
          title={slide.title}
          subtitle={slide.subtitle}
          icon={slide.icon}
          color={slide.color}
          onClick={() => setActiveIndex(i)}
        />
      ))}
    </>
  );
}

export default function HeroSlider3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [is3DSupported, setIs3DSupported] = useState(true);

  const next = useCallback(() => {
    setActiveIndex((p) => (p + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setIs3DSupported(false);
    } catch {
      setIs3DSupported(false);
    }
  }, []);

  if (!is3DSupported) {
    return <FallbackSlider activeIndex={activeIndex} setActiveIndex={setActiveIndex} />;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        onError={() => setIs3DSupported(false)}
      >
        <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </Canvas>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Précédent"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Suivant"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-accent w-8" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function FallbackSlider({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
      <div className="flex gap-6 transition-transform duration-700" style={{ transform: `translateX(${-activeIndex * 320}px)` }}>
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-[300px] h-[200px] rounded-2xl p-6 flex flex-col justify-center items-center text-center text-white cursor-pointer transition-all duration-500 ${
              i === activeIndex ? "scale-110 shadow-2xl" : "scale-90 opacity-50"
            }`}
            style={{ background: `linear-gradient(135deg, ${slide.color}, ${slide.color}dd)` }}
          >
            <span className="text-4xl mb-3">{slide.icon}</span>
            <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
            <p className="text-sm text-white/80">{slide.subtitle}</p>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-accent w-8" : "bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
