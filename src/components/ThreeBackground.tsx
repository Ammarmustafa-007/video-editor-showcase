import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';

/**
 * Creates a circular glow texture programmatically (no external assets).
 */
function createCircleTexture(size = 64): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(0.7, 'rgba(255,255,255,0.15)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Custom star field using circular point sprites — avoids the square
 * particles that the default drei <Stars> component produces.
 */
function CircularStars({
  count = 4000,
  radius = 100,
  depth = 80,
  sizeFactor = 1,
  speed = 0.1,
  opacity = 0.9,
}: {
  count?: number;
  radius?: number;
  depth?: number;
  sizeFactor?: number;
  speed?: number;
  opacity?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * radius;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = (Math.random() - 0.5) * depth;

      sizes[i] = (Math.random() * 1.5 + 0.3) * sizeFactor;
    }

    return { positions, sizes };
  }, [count, radius, depth, sizeFactor]);

  const circleMap = useMemo(() => createCircleTexture(64), []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * speed * 0.05;
    pointsRef.current.rotation.x += delta * speed * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        map={circleMap}
        size={sizeFactor}
        color="#ffffff"
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
}

/**
 * Tiny bright "glowing" particles scattered across the scene to mimic
 * distant galaxies / bright individual stars that shimmer.
 */
function GlowingParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#aaccff'),
      new THREE.Color('#ffeedd'),
      new THREE.Color('#ccddff'),
      new THREE.Color('#ffccaa'),
      new THREE.Color('#ddeeff'),
      new THREE.Color('#aabbff'),
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 80;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, [count]);

  const circleMap = useMemo(() => createCircleTexture(64), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={circleMap}
        size={0.4}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
}

/**
 * A very subtle camera drift that responds to page scroll,
 * creating a parallax / fly-through-space effect.
 */
function CameraDrift({ scrollYProgress }: { scrollYProgress: any }) {
  useFrame((state) => {
    const scroll = scrollYProgress.get() || 0;
    state.camera.position.z = 15 - scroll * 8;
    state.camera.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
    state.camera.position.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.2;
  });

  return null;
}

export function ThreeBackground() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(10,15,40,0.4) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 80% 30%, rgba(30,10,50,0.3) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 50% 80%, rgba(5,20,30,0.3) 0%, transparent 50%), ' +
          'linear-gradient(180deg, #010204 0%, #030610 30%, #06081a 60%, #020408 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        {/* Deep space fog */}
        <fog attach="fog" args={['#010204', 50, 130]} />

        {/* Very dim ambient so stars pop against black */}
        <ambientLight intensity={0.05} />

        {/* Distant nebula-like colored glows */}
        <pointLight position={[40, 20, -30]} intensity={0.5} color="#0d1b5e" distance={100} decay={2} />
        <pointLight position={[-30, -15, -40]} intensity={0.35} color="#0d3a1e" distance={80} decay={2} />
        <pointLight position={[10, -30, -50]} intensity={0.25} color="#2a0845" distance={90} decay={2} />

        {/* Primary star field — tiny dots */}
        <CircularStars count={1200} radius={120} depth={90} sizeFactor={0.15} speed={0.3} opacity={0.8} />

        {/* A few slightly brighter accent stars */}
        <CircularStars count={300} radius={80} depth={60} sizeFactor={0.35} speed={0.5} opacity={0.6} />

        {/* Faint distant dust */}
        <CircularStars count={500} radius={200} depth={100} sizeFactor={0.08} speed={0.12} opacity={0.4} />

        {/* Subtle glowing particles */}
        <GlowingParticles count={80} />

        {/* Scroll-based camera drift */}
        <CameraDrift scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
