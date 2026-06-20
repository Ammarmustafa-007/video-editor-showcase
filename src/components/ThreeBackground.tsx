import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';

const NLE_COLORS = [
  '#2196F3', // Video Blue
  '#4CAF50', // Audio Green
  '#9C27B0', // Adjustment Magenta
  '#FFEB3B', // Title Yellow
  '#F44336', // Error/Marker Red
  '#00BCD4', // Cyan
];

function FloatingClips({ scrollYProgress }: { scrollYProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate 80 random clip meshes
  const clips = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      // Distribute in a cylinder around the Z axis
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 15 + 5;
      const z = (Math.random() - 0.5) * 40;
      
      const isAudio = Math.random() > 0.6;
      const color = NLE_COLORS[Math.floor(Math.random() * NLE_COLORS.length)];
      
      return {
        id: i,
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, z] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: [Math.random() * 3 + 1, isAudio ? 0.3 : 0.8, Math.random() * 4 + 1] as [number, number, number],
        color,
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const scroll = scrollYProgress.get() || 0;
    
    // Smoothly rotate the entire group and pull it forward based on scroll
    groupRef.current.rotation.z = scroll * Math.PI;
    groupRef.current.position.z = scroll * 30; // Fly through effect
    
    // Constant slow rotation
    groupRef.current.rotation.x += delta * 0.05;
    groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      {clips.map((clip) => (
        <Float key={clip.id} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={clip.position} rotation={clip.rotation} scale={clip.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={clip.color}
              transparent
              opacity={0.8}
              roughness={0.2}
              metalness={0.8}
              emissive={clip.color}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function ThreeBackground() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-brand-navy-deep to-[#050810]">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 60 }} 
        dpr={[1, 1.5]} 
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={['#050810', 10, 40]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <spotLight position={[-10, -10, 5]} intensity={2} color="#2196F3" />
        
        <FloatingClips scrollYProgress={scrollYProgress} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
