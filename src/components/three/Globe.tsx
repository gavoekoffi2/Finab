"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import landDots from "@/data/landDots";

export interface GlobeStop {
  lat: number;
  lng: number;
  color: string;
}

const R = 1;
const DEG = Math.PI / 180;

function toVector(lat: number, lng: number, radius = R) {
  const phi = (90 - lat) * DEG;
  const theta = (lng + 180) * DEG;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Orientation du globe qui place une ville face à la caméra
function orientationFor(lat: number, lng: number) {
  const v = toVector(lat, lng);
  return { x: lat * DEG, y: -Math.atan2(v.x, v.z) };
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function wrapAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/* ---------- Continents en points lumineux ---------- */

const dotVertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vFacing;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * position);
    vFacing = dot(n, normalize(-mvPosition.xyz));
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d) * smoothstep(-0.15, 0.45, vFacing);
    gl_FragColor = vec4(uColor, alpha * 0.95);
  }
`;

function LandDots() {
  const { gl } = useThree();
  const geometry = useMemo(() => {
    const count = landDots.length / 2;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const v = toVector(landDots[i * 2], landDots[i * 2 + 1], R * 1.002);
      positions.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color("#7ee2a4") },
          uSize: { value: 17 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
        },
        vertexShader: dotVertex,
        fragmentShader: dotFragment,
        transparent: true,
        depthWrite: false,
      }),
    [gl]
  );

  return <points geometry={geometry} material={material} />;
}

/* ---------- Halo atmosphérique ---------- */

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  void main() {
    // 0 au bord extérieur du halo, 1 au bord du globe : fondu doux vers l'extérieur
    float k = clamp(-dot(vNormal, vec3(0.0, 0.0, 1.0)) / 0.48, 0.0, 1.0);
    float intensity = pow(k, 1.8);
    gl_FragColor = vec4(uColor, 1.0) * intensity * 1.1;
  }
`;

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color("#22c55e") } },
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  return (
    <mesh scale={1.14} material={material}>
      <sphereGeometry args={[R, 64, 64]} />
    </mesh>
  );
}

/* ---------- Trajets entre les villes ---------- */

function buildArc(a: GlobeStop, b: GlobeStop) {
  const va = toVector(a.lat, a.lng).normalize();
  const vb = toVector(b.lat, b.lng).normalize();
  const angle = va.angleTo(vb);
  const lift = 0.12 + angle * 0.22;
  const points: THREE.Vector3[] = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = new THREE.Vector3().copy(va).lerp(vb, t).normalize();
    p.multiplyScalar(R * (1 + lift * Math.sin(Math.PI * t)));
    points.push(p);
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 160, 0.0065, 8, false);
  return { curve, geometry, indexCount: geometry.index ? geometry.index.count : 0 };
}

function Arcs({ stops, progress }: { stops: GlobeStop[]; progress: MotionValue<number> }) {
  const arcs = useMemo(
    () => stops.slice(0, -1).map((stop, i) => ({ ...buildArc(stop, stops[i + 1]), color: stops[i + 1].color })),
    [stops]
  );
  const heads = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const t = getT(progress.get(), stops.length);
    arcs.forEach((arc, i) => {
      const p = smoothstep(0.05, 0.75, t - i);
      arc.geometry.setDrawRange(0, Math.floor((arc.indexCount / 6) * p) * 6);
      const head = heads.current[i];
      if (head) {
        head.visible = p > 0.01 && p < 0.99;
        head.position.copy(arc.curve.getPoint(p));
      }
    });
  });

  return (
    <>
      {arcs.map((arc, i) => (
        <group key={i}>
          <mesh geometry={arc.geometry}>
            <meshBasicMaterial color={arc.color} transparent opacity={0.95} toneMapped={false} />
          </mesh>
          <mesh ref={(el) => { heads.current[i] = el; }}>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ---------- Repères des villes ---------- */

function Marker({ stop, index, progress, total }: { stop: GlobeStop; index: number; progress: MotionValue<number>; total: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const dot = useRef<THREE.Mesh>(null);
  const position = useMemo(() => toVector(stop.lat, stop.lng, R * 1.01), [stop]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    return q;
  }, [position]);

  useFrame(({ clock }) => {
    const t = getT(progress.get(), total);
    const active = Math.max(0, 1 - Math.abs(t - index) * 1.6);
    const pulse = (clock.elapsedTime * 0.8 + index * 0.3) % 1;
    if (ring.current) {
      const s = 1 + pulse * (1.6 + active * 2.4);
      ring.current.scale.setScalar(s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - pulse) * (0.35 + active * 0.65);
    }
    if (dot.current) dot.current.scale.setScalar(1 + active * 0.9);
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh ref={dot}>
        <circleGeometry args={[0.024, 32]} />
        <meshBasicMaterial color={stop.color} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.028, 0.036, 48]} />
        <meshBasicMaterial color={stop.color} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------- Globe complet piloté par le défilement ---------- */

// Convertit la progression du défilement (0 → 1) en position sur le trajet (0 → nombre d'étapes - 1)
function getT(p: number, total: number) {
  return Math.min(1, Math.max(0, (p - 0.04) / 0.88)) * (total - 1);
}

function Scene({ stops, progress }: { stops: GlobeStop[]; progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const orientations = useMemo(() => stops.map((s) => orientationFor(s.lat, s.lng)), [stops]);

  useFrame(({ clock, camera, size }, delta) => {
    // Recule la caméra sur les écrans en portrait pour garder le globe entier
    const aspect = size.width / size.height;
    const z = aspect < 1 ? 3.7 / aspect : 3.7;
    camera.position.z += (z - camera.position.z) * 0.1;

    const g = group.current;
    if (!g) return;
    const t = getT(progress.get(), stops.length);
    const i = Math.min(Math.floor(t), stops.length - 2);
    const f = smoothstep(0.15, 0.85, t - i);
    const from = orientations[i];
    const to = orientations[i + 1];
    const targetX = from.x + (to.x - from.x) * f - 0.12;
    const targetY = from.y + wrapAngle(to.y - from.y) * f + Math.sin(clock.elapsedTime * 0.25) * 0.04;

    const k = 1 - Math.pow(0.002, delta);
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.rotation.y += wrapAngle(targetY - g.rotation.y) * k;
  });

  const initial = orientations[0];

  return (
    <group ref={group} rotation={[initial.x - 0.12, initial.y, 0]}>
      <mesh>
        <sphereGeometry args={[R * 0.995, 64, 64]} />
        <meshBasicMaterial color="#04140b" />
      </mesh>
      <LandDots />
      <Arcs stops={stops} progress={progress} />
      {stops.map((stop, i) => (
        <Marker key={i} stop={stop} index={i} progress={progress} total={stops.length} />
      ))}
    </group>
  );
}

export default function Globe({
  stops,
  progress,
  active = true,
}: {
  stops: GlobeStop[];
  progress: MotionValue<number>;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.7], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      style={{ width: "100%", height: "100%" }}
    >
      <Atmosphere />
      <Scene stops={stops} progress={progress} />
    </Canvas>
  );
}
