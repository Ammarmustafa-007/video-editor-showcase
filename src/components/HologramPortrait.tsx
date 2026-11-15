import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import portraitUrl from "@/assets/holo/portrait.webp";
import depthUrl from "@/assets/holo/depth.png";

/**
 * Abdullah's portrait rebuilt as a hologram.
 *
 * Every visible pixel of the cut-out photo becomes a glowing point. Its depth comes from a depth map made from the same
 * photo, so the point cloud has a real face shape (nose, glasses, cheeks). On load the points fly in from a scattered
 * cloud and assemble from the top down; after that the whole head turns to look at the mouse.
 */

type Cloud = { target: Float32Array; start: Float32Array; color: Float32Array; rand: Float32Array; delay: Float32Array; count: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}

function pixels(im: HTMLImageElement, w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(im, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

async function buildCloud(step: number): Promise<Cloud> {
  const [photo, depth] = await Promise.all([loadImage(portraitUrl), loadImage(depthUrl)]);
  const W = photo.naturalWidth;
  const H = photo.naturalHeight;
  const px = pixels(photo, W, H);
  const dp = pixels(depth, W, H);
  const t: number[] = [], s: number[] = [], col: number[] = [], rnd: number[] = [], del: number[] = [];
  const scale = 3.2 / H; // the bust is 3.2 units tall
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const jx = x + (Math.random() - 0.5) * step * 0.9;
      const jy = y + (Math.random() - 0.5) * step * 0.9;
      const ix = Math.min(W - 1, Math.max(0, Math.round(jx)));
      const iy = Math.min(H - 1, Math.max(0, Math.round(jy)));
      const i = (iy * W + ix) * 4;
      const a = px[i + 3] / 255;
      if (a < 0.5) continue;
      // a few points thinned out at the soft edges so the outline dissolves
      if (a < 0.85 && Math.random() > a) continue;
      const d = dp[i] / 255;
      const X = (jx - W / 2) * scale;
      const Y = (H / 2 - jy) * scale;
      const Z = (d - 0.62) * 1.25; // face forward, ears and shoulders back
      t.push(X, Y, Z);
      // scattered start: a wide shell around the bust
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 5;
      s.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph) - 2);
      col.push(px[i] / 255, px[i + 1] / 255, px[i + 2] / 255);
      rnd.push(Math.random());
      del.push((jy / H) * 0.55 + Math.random() * 0.25); // assembles from the top of the head down
    }
  }
  return {
    target: new Float32Array(t), start: new Float32Array(s), color: new Float32Array(col),
    rand: new Float32Array(rnd), delay: new Float32Array(del), count: t.length / 3,
  };
}

const vertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aStart;
  attribute vec3 aColor;
  attribute float aRand;
  attribute float aDelay;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vY;
  varying float vSettle;

  float easeOut(float t) { return 1.0 - pow(1.0 - t, 3.0); }

  void main() {
    float t = clamp((uProgress - aDelay) / 0.55, 0.0, 1.0);
    float e = easeOut(t);
    vec3 p = mix(aStart, position, e);
    // while flying, points swirl a little; once settled they only shimmer
    float swirl = (1.0 - e);
    p.x += sin(uTime * 1.3 + aRand * 40.0) * 0.35 * swirl;
    p.y += cos(uTime * 1.1 + aRand * 30.0) * 0.35 * swirl;
    p.z += sin(uTime * 2.0 + aRand * 12.0) * 0.006;
    // a glitch now and then: a thin horizontal slice jumps sideways
    float g = step(0.985, fract(uTime * 0.23)) * step(abs(fract(p.y * 0.6 + uTime) - 0.5), 0.04);
    p.x += g * 0.12 * sign(aRand - 0.5);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.65 + aRand * 0.7) * (1.0 / -mv.z) * (1.0 + swirl * 1.5);
    vColor = aColor;
    vAlpha = 0.25 + 0.75 * e;
    vY = position.y;
    vSettle = e;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vY;
  varying float vSettle;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    float lum = dot(vColor, vec3(0.299, 0.587, 0.114));
    // hologram palette: shadows deep violet, mids lilac, highlights near-white with a cyan edge
    vec3 deep = vec3(0.30, 0.12, 0.62);
    vec3 lilac = vec3(0.70, 0.52, 1.0);
    vec3 hi = vec3(0.86, 0.94, 1.0);
    vec3 col = mix(deep, lilac, smoothstep(0.05, 0.45, lum));
    col = mix(col, hi, smoothstep(0.55, 0.95, lum));
    // keep a trace of the real colours so the face reads
    col = mix(col, vColor * 1.25, 0.18);
    // scan lines + a bright band sweeping up the bust
    float lines = 0.78 + 0.22 * step(0.5, fract(vY * 26.0));
    float band = smoothstep(0.18, 0.0, abs(fract(vY * 0.16 - uTime * 0.12) - 0.5) - 0.32);
    col *= lines;
    col += vec3(0.55, 0.45, 1.0) * band * 0.55 * vSettle;
    float flicker = 0.92 + 0.08 * sin(uTime * 37.0 + vY * 3.0);
    gl_FragColor = vec4(col * flicker, soft * vAlpha * (0.55 + lum * 0.6));
  }
`;

function Bust({ cloud, reduced }: { cloud: Cloud; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const pointer = useRef({ x: 0, y: 0, active: false });
  const start = useRef(0);               // the clock starts on the first drawn frame (shader warm-up doesn't eat the intro)

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current.active = true;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(cloud.target, 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(cloud.start, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(cloud.color, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(cloud.rand, 1));
    g.setAttribute("aDelay", new THREE.BufferAttribute(cloud.delay, 1));
    return g;
  }, [cloud]);

  const uniforms = useMemo(() => ({
    uProgress: { value: reduced ? 2 : 0 },
    uTime: { value: 0 },
    uSize: { value: cloud.count > 30000 ? 15 : 22 },
    uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
  }), [cloud, gl, reduced]);

  useFrame((state, dt) => {
    const u = mat.current?.uniforms;
    if (!u || !group.current) return;
    u.uTime.value = state.clock.elapsedTime;
    if (!start.current) start.current = performance.now();
    if (!reduced) u.uProgress.value = Math.min(2, (performance.now() - start.current) / 1000 / 2.6);
    // look at the mouse (or a slow idle sway on touch screens / before the mouse moves)
    const p = pointer.current;
    const tx = p.active ? p.x * 0.55 : Math.sin(state.clock.elapsedTime * 0.35) * 0.25;
    const ty = p.active ? p.y * 0.28 : Math.sin(state.clock.elapsedTime * 0.27) * 0.06;
    const k = 1 - Math.pow(0.0025, dt);
    group.current.rotation.y += (tx - group.current.rotation.y) * k;
    group.current.rotation.x += (ty - group.current.rotation.x) * k;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <group ref={group}>
      <points geometry={geo}>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** The projector the hologram floats above: a glowing ring and a soft cone of light. */
function Projector() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ring.current) (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(s.clock.elapsedTime * 2) * 0.15;
  });
  const cone = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, "rgba(168,120,255,0)");
    g.addColorStop(1, "rgba(168,120,255,0.16)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group position={[0, -1.75, 0]} scale={[1, 1, 0.55]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.98, 1.03, 96]} />
        <meshBasicMaterial color="#b18cff" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.98, 96]} />
        <meshBasicMaterial color="#6d3fd6" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1.25, 1.0, 1.4, 64, 1, true]} />
        <meshBasicMaterial map={cone} transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function HologramPortrait({ className = "" }: { className?: string }) {
  const [cloud, setCloud] = useState<Cloud | null>(null);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const small = window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4;
    buildCloud(small ? 3 : 2).then(setCloud).catch(() => setCloud(null));
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className} aria-label="Hologram portrait of Abdullah Qureshi" role="img">
      {cloud && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 0.35, 6.2], fov: 40 }}
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <Bust cloud={cloud} reduced={!!reduced} />
          <Projector />
        </Canvas>
      )}
    </div>
  );
}

export default HologramPortrait;
