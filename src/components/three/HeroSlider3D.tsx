"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { heroSlides } from "@/data/content";

function SlideCard({
  index,
  activeIndex,
  total,
  color,
  onClick,
}: {
  index: number;
  activeIndex: number;
  total: number;
  color: string;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  const angle = ((index - activeIndex) / total) * Math.PI * 2;
  const radius = 3.2;
  const targetX = Math.sin(angle) * radius;
  const targetZ = Math.cos(angle) * radius - 1.5;
  const isActive = index === activeIndex;
  const targetScale = isActive ? 1.2 : 0.7;
  const targetOpacity = isActive ? 1 : 0.4;
  const targetY = isActive ? 0.15 : -0.15;

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    const speed = 3.5 * delta;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, speed);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, speed);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, speed);
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, speed);
    meshRef.current.scale.set(s, s, s);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, -angle * 0.25, speed);
    const targetRotX = isActive ? -0.05 : 0.05;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, speed);
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, speed);
    if (glowRef.current) {
      glowRef.current.opacity = THREE.MathUtils.lerp(glowRef.current.opacity, isActive ? 0.15 : 0, speed);
    }
  });

  return (
    <group ref={meshRef} onClick={onClick}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={isActive ? 0.4 : 0.1}>
        <RoundedBox args={[2.8, 1.7, 0.1]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            ref={materialRef}
            color={color}
            transparent
            roughness={0.2}
            metalness={0.15}
            envMapIntensity={0.8}
          />
        </RoundedBox>
        <mesh position={[0, 0, -0.1]} scale={[3.2, 2, 1]}>
          <planeGeometry />
          <meshBasicMaterial ref={glowRef} color={color} transparent opacity={0} />
        </mesh>
        <mesh position={[0, -0.55, 0.06]}>
          <planeGeometry args={[1.8, 0.04]} />
          <meshBasicMaterial color="#D4A843" transparent opacity={isActive ? 0.8 : 0.2} />
        </mesh>
        {[[-1.1, 0.65], [-0.95, 0.65], [-0.8, 0.65]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.06]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color={i === 0 ? "#ff6b6b" : i === 1 ? "#ffd93d" : "#6bcb77"} />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

function Scene({ activeIndex, setActiveIndex }: { activeIndex: number; setActiveIndex: (i: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#D4A843" />
      <pointLight position={[3, -2, 4]} intensity={0.2} color="#2A5580" />
      <Environment preset="city" />
      {heroSlides.map((slide, i) => (
        <SlideCard
          key={slide.id}
          index={i}
          activeIndex={activeIndex}
          total={heroSlides.length}
          color={slide.color}
          onClick={() => setActiveIndex(i)}
        />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0F2440" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

export default function HeroSlider3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((p) => (p + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 4500);
    return () => clearInterval(interval);
  }, [next]);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setIs3DSupported(false);
    } catch {
      setIs3DSupported(false);
    }
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (!is3DSupported || isMobile) {
    return <FallbackSlider activeIndex={activeIndex} setActiveIndex={setActiveIndex} next={next} prev={prev} />;
  }

  return (
    <div className="relative w-full h-[420px] md:h-[480px]">
      <Canvas
        camera={{ position: [0, 0.3, 4.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        onError={() => setIs3DSupported(false)}
        dpr={[1, 1.5]}
      >
        <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </Canvas>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-white/90 font-bold text-lg">{heroSlides[activeIndex].title}</p>
        <p className="text-white/50 text-sm mt-1 max-w-xs mx-auto">{heroSlides[activeIndex].subtitle}</p>
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Précédent"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Suivant"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              i === activeIndex ? "bg-accent w-8" : "bg-white/30 w-2 hover:bg-white/50"
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
  next,
  prev,
}: {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  next: () => void;
  prev: () => void;
}) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  return (
    <div
      className="relative w-full h-[350px] md:h-[420px] flex items-center justify-center overflow-hidden"
      onTouchStart={(e) => { touchStartX.current = e.targetTouches[0].clientX; }}
      onTouchMove={(e) => { touchEndX.current = e.targetTouches[0].clientX; }}
      onTouchEnd={() => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
      }}
    >
      <div className="relative w-full h-full" style={{ perspective: "1200px" }}>
        {heroSlides.map((slide, i) => {
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = i === activeIndex;

          return (
            <div
              key={slide.id}
              onClick={() => setActiveIndex(i)}
              className="absolute top-1/2 left-1/2 w-[260px] h-[160px] md:w-[320px] md:h-[190px] rounded-2xl cursor-pointer transition-all duration-700 ease-out"
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 110}px) translateZ(${-absOffset * 150}px) rotateY(${offset * -15}deg) scale(${isActive ? 1.1 : 0.85 - absOffset * 0.1})`,
                zIndex: 10 - absOffset,
                opacity: absOffset > 2 ? 0 : isActive ? 1 : 0.5 - absOffset * 0.15,
                background: `linear-gradient(135deg, ${slide.color}, ${slide.color}cc)`,
                boxShadow: isActive
                  ? `0 25px 50px -12px ${slide.color}80, 0 0 40px ${slide.color}30`
                  : "0 10px 30px -10px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute top-3 left-3 flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400/80" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
                <div className="w-2 h-2 rounded-full bg-green-400/80" />
              </div>
              <div className="flex flex-col items-center justify-center h-full text-white p-5">
                <span className="text-3xl md:text-4xl mb-2">{slide.icon}</span>
                <h3 className="text-base md:text-lg font-bold text-center">{slide.title}</h3>
                {isActive && (
                  <p className="text-[11px] md:text-xs text-white/70 text-center mt-1.5 line-clamp-2">
                    {slide.subtitle}
                  </p>
                )}
              </div>
              <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-white/20" />
            </div>
          );
        })}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl cursor-pointer z-20"
        aria-label="Précédent"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl cursor-pointer z-20"
        aria-label="Suivant"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              i === activeIndex ? "bg-accent w-8" : "bg-white/30 w-2 hover:bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
