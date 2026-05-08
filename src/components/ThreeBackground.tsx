import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Sphere, TorusKnot, MeshDistortMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';

function AbstractShapes() {
  const sphereRef1 = useRef<THREE.Mesh>(null);
  const sphereRef2 = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const { scrollYProgress } = useScroll();

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    
    if (groupRef.current) {
      // The entire group twists and zooms based on scroll
      groupRef.current.rotation.y = scroll * Math.PI * 4;
      groupRef.current.rotation.x = scroll * Math.PI * 2;
      groupRef.current.position.z = scroll * 15 - 5; // Zooms in as you scroll down
    }

    if (sphereRef1.current) {
      sphereRef1.current.rotation.x = state.clock.elapsedTime * 0.2 + scroll * Math.PI * 2;
      sphereRef1.current.rotation.y = state.clock.elapsedTime * 0.3 + scroll * Math.PI * 2;
    }
    if (sphereRef2.current) {
      sphereRef2.current.rotation.x = state.clock.elapsedTime * 0.1 - scroll * Math.PI * 2;
      sphereRef2.current.rotation.y = state.clock.elapsedTime * 0.2 - scroll * Math.PI * 2;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.5 + scroll * 10;
      torusRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={3} floatIntensity={4}>
        <Sphere ref={sphereRef1} args={[1, 64, 64]} position={[-4, 3, -2]}>
          <MeshDistortMaterial
            color="#FFD700" // brand yellow
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={2}
          />
        </Sphere>
      </Float>
      
      <Float speed={2} rotationIntensity={2} floatIntensity={3}>
        <Sphere ref={sphereRef2} args={[1.5, 64, 64]} position={[4, -2, -4]}>
          <MeshDistortMaterial
            color="#2E8B57" // brand green
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.3}
            distort={0.6}
            speed={1.5}
            wireframe
          />
        </Sphere>
      </Float>

      <Float speed={3} rotationIntensity={5} floatIntensity={5}>
        <TorusKnot ref={torusRef} args={[1.2, 0.4, 128, 32]} position={[0, -4, -8]}>
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={2}
            chromaticAberration={1}
            anisotropy={0.3}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.2}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#ffffff"
          />
        </TorusKnot>
      </Float>
    </group>
  );
}

function Particles() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const dummy = new THREE.Object3D();
  const { scrollYProgress } = useScroll();

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;
    
    if (mesh.current) {
      for (let i = 0; i < count; i++) {
        const x = (Math.sin((i + time) * 0.1) * 20);
        const y = (Math.cos((i + time) * 0.1) * 20) + (scroll * 100) % 20; // Falling effect on scroll
        const z = (Math.sin((i + time) * 0.1) * 20) - 10 + scroll * 20;
        
        dummy.position.set(x, y, z);
        dummy.rotation.set(time * 0.1 + i, time * 0.1 + i, 0);
        
        // Scale pulses
        const s = Math.sin(time + i) * 0.1 + 0.1;
        dummy.scale.set(s, s, s);
        
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.5, 0.1, 0.1]} /> {/* Tiny cinematic debris/tape shapes */}
      <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
    </instancedMesh>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-50 bg-brand-navy-deep">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <fog attach="fog" args={['#0a0f18', 5, 30]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#FFD700" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
        <AbstractShapes />
        <Particles />
      </Canvas>
    </div>
  );
}
