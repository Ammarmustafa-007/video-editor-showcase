import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import portraitUrl from "@/assets/holo/bust.webp";
import depthUrl from "@/assets/holo/bust-depth.png";

/**
 * Abdullah's portrait rebuilt as a hologram.
 *
 * Every visible pixel of the cut-out photo becomes a glowing point. Its depth comes from a depth map made from the same
 * photo, so the point cloud has a real face shape (nose, glasses, cheeks). On load the points fly in from a scattered
 * cloud and assemble from the top down; after that the whole head turns to look at the mouse.
 */

type Cloud = { target: Float32Array; start: Float32Array; color: Float32Array; rand: Float32Array; delay: Float32Array; count: number; halfW: number };

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
  const scale = 3.75 / H; // head to the bottom of the bust: 3.75 units
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
      const Y = 1.78 - jy * scale;
      const Z = (d - 0.62) * 1.25; // face forward, ears and shoulders back
      t.push(X, Y, Z);
      // scattered start: a wide shell around the bust
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 5;
      s.push(r * Math.sin(ph) * Math.cos(th) * 1.6, r * Math.sin(ph) * Math.sin(th) * 0.8, r * Math.cos(ph) - 2);
      col.push(px[i] / 255, px[i + 1] / 255, px[i + 2] / 255);
      rnd.push(Math.random());
      del.push((jy / H) * 0.55 + Math.random() * 0.25); // assembles from the top of the head down
    }
  }
  return {
    target: new Float32Array(t), start: new Float32Array(s), color: new Float32Array(col),
    rand: new Float32Array(rnd), delay: new Float32Array(del), count: t.length / 3, halfW: (W / 2) * scale,
  };
}

const vertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uYaw;
  uniform float uPitch;
  uniform float uHalfW;
  attribute vec3 aStart;
  attribute vec3 aColor;
  attribute float aRand;
  attribute float aDelay;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vY;
  varying float vX;
  varying float vSettle;

  float easeOut(float t) { return 1.0 - pow(1.0 - t, 3.0); }

  // only the head turns: points above the neck and inside the head's width follow the mouse,
  // the shoulders and chest stay where they are, with a soft blend across the neck
  vec3 turnHead(vec3 q) {
    float w = smoothstep(-0.78, -0.12, q.y) * (1.0 - smoothstep(0.8, 1.1, abs(q.x)));
    w = w * w * (3.0 - 2.0 * w);
    vec3 pivot = vec3(0.0, -0.25, -0.6); // roughly where the neck meets the skull, behind the face
    vec3 r = q - pivot;
    float cy = cos(uYaw * w), sy = sin(uYaw * w);
    r = vec3(cy * r.x + sy * r.z, r.y, -sy * r.x + cy * r.z);
    float cp = cos(uPitch * w), sp = sin(uPitch * w);
    r = vec3(r.x, cp * r.y - sp * r.z, sp * r.y + cp * r.z);
    return r + pivot;
  }

  void main() {
    float t = clamp((uProgress - aDelay) / 0.55, 0.0, 1.0);
    float e = easeOut(t);
    vec3 p = mix(aStart, turnHead(position), e);
    // while flying, points swirl a little; once settled they only shimmer
    float swirl = (1.0 - e);
    p.x += sin(uTime * 1.3 + aRand * 40.0) * 0.35 * swirl;
    p.y += cos(uTime * 1.1 + aRand * 30.0) * 0.35 * swirl;
    p.z += sin(uTime * 2.0 + aRand * 12.0) * 0.006;
    // a glitch now and then: a thin horizontal slice jumps sideways
    float g = step(0.985, fract(uTime * 0.23)) * step(abs(fract(p.y * 0.6 + uTime) - 0.5), 0.04);
    p.x += g * 0.12 * sign(aRand - 0.5);

    // the bust dissolves into the projector beam: points near the bottom thin out and drift down
    // ...and the outer edges of the shoulders thin out too, so the sides never end in a straight cut
    float side = 1.0 - smoothstep(uHalfW * 0.72, uHalfW * 0.98, abs(position.x));
    float keep = smoothstep(-1.95, -0.85, position.y) * side;
    float alive = step(aRand, keep * 1.15);
    p.y -= (1.0 - keep) * (0.15 + 0.25 * fract(uTime * 0.2 + aRand * 7.0)) * e;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.65 + aRand * 0.7) * (1.0 / -mv.z) * (1.0 + swirl * 1.5) * alive;
    vColor = aColor;
    vAlpha = (0.25 + 0.75 * e) * (0.35 + 0.65 * keep);
    vY = position.y;
    vX = position.x;
    vSettle = e;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vY;
  varying float vX;
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
    // iridescence: a slow wave of cyan and pink washing across the bust
    float w = sin(vY * 1.6 + vX * 1.2 - uTime * 0.7);
    vec3 cyan = vec3(0.35, 0.85, 1.0);
    vec3 pink = vec3(1.0, 0.45, 0.85);
    col = mix(col, col * mix(pink, cyan, 0.5 + 0.5 * w) * 1.35, 0.32);
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
    uYaw: { value: 0 },
    uPitch: { value: 0 },
    uHalfW: { value: cloud.halfW },
  }), [cloud, gl, reduced]);

  useFrame((state, dt) => {
    const u = mat.current?.uniforms;
    if (!u || !group.current) return;
    u.uTime.value = state.clock.elapsedTime;
    if (!start.current) start.current = performance.now();
    if (!reduced) u.uProgress.value = Math.min(2, (performance.now() - start.current) / 1000 / 2.6);
    // the face looks at the mouse (or sways slowly on touch screens / before the mouse moves); the body stays still
    const p = pointer.current;
    const tx = p.active ? p.x * 0.42 : Math.sin(state.clock.elapsedTime * 0.35) * 0.16;
    const ty = p.active ? p.y * 0.2 : Math.sin(state.clock.elapsedTime * 0.27) * 0.04;
    const k = 1 - Math.pow(0.02, dt); // slower, softer follow
    u.uYaw.value += (tx - u.uYaw.value) * k;
    u.uPitch.value += (ty - u.uPitch.value) * k;
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

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const beamFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    // brightest at the projector, gone well before the top: no hard lid
    float h = pow(1.0 - vUv.y, 2.2);
    // facing the camera = see-through middle; the silhouette edges fade out too, so there is no hard outline
    float facing = abs(dot(vN, vV));
    float edge = smoothstep(0.25, 0.85, facing);
    // a few soft rays drifting round the cone
    float rays = 0.75 + 0.25 * sin(vUv.x * 6.2831 * 9.0 + uTime * 0.6) * sin(vUv.x * 6.2831 * 4.0 - uTime * 0.4);
    vec3 col = mix(vec3(0.78, 0.47, 1.0), vec3(0.55, 0.82, 1.0), vUv.y);
    gl_FragColor = vec4(col, h * edge * rays * 0.16);
  }
`;

function radialTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [o, col] of stops) g.addColorStop(o, col);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/** The projector the hologram floats above: rings on the floor, a cone of light that opens out and melts into the page. */
function Projector() {
  const ring = useRef<THREE.Mesh>(null);
  const ticks = useRef<THREE.Group>(null);
  const beam = useRef<THREE.ShaderMaterial>(null);
  const floorGlow = useMemo(() => radialTexture([[0, "rgba(170,120,255,0.55)"], [0.35, "rgba(140,90,240,0.22)"], [1, "rgba(120,80,230,0)"]]), []);
  const backGlow = useMemo(() => radialTexture([[0, "rgba(150,100,255,0.22)"], [0.5, "rgba(110,80,220,0.08)"], [1, "rgba(90,60,200,0)"]]), []);
  const beamUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ring.current) (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 2) * 0.18;
    if (ticks.current) ticks.current.rotation.y = t * 0.25;
    if (beam.current) beam.current.uniforms.uTime.value = t;
  });
  const tickMarks = useMemo(() => Array.from({ length: 72 }, (_, i) => i), []);
  return (
    <group position={[0, -2.02, 0]}>
      {/* a wide soft glow behind the bust, so the light fades into the page instead of ending at an edge */}
      <mesh position={[0, 2.1, -1.6]}>
        <planeGeometry args={[9, 7.5]} />
        <meshBasicMaterial map={backGlow} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* light spilling out across the floor on both sides */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} scale={[1, 0.42, 1]}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial map={floorGlow} transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <group scale={[1, 1, 0.5]}>
        <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.52, 1.58, 128]} />
          <meshBasicMaterial color="#c9a6ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.18, 1.2, 128]} />
          <meshBasicMaterial color="#7fd8ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.52, 96]} />
          <meshBasicMaterial color="#6d3fd6" transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <group ref={ticks}>
          {tickMarks.map((i) => (
            <mesh key={i} position={[Math.cos((i / 72) * Math.PI * 2) * 1.7, 0, Math.sin((i / 72) * Math.PI * 2) * 1.7]} rotation={[-Math.PI / 2, 0, -(i / 72) * Math.PI * 2]}>
              <planeGeometry args={[i % 6 === 0 ? 0.12 : 0.05, 0.012]} />
              <meshBasicMaterial color={i % 6 === 0 ? "#ff8ad8" : "#b79bff"} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
        {/* the beam opens wide as it rises (1.5 at the base, 3.2 at the top) and fades out on every side */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[3.2, 1.52, 3.0, 96, 1, true]} />
          <shaderMaterial ref={beam} vertexShader={beamVertex} fragmentShader={beamFragment} uniforms={beamUniforms} transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
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
    <div
      ref={wrap}
      className={className}
      aria-label="Hologram portrait of Abdullah Qureshi"
      role="img"
      // the canvas is wider than its box; its edges and floor fade to nothing so it never reads as a cut-out
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent), linear-gradient(to bottom, #000 78%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent), linear-gradient(to bottom, #000 78%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {cloud && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 0.05, 6.9], fov: 40 }}
          dpr={[1, 1.75]}
          resize={{ offsetSize: true }} // size from layout, not from the on-screen (scaled) box while it docks
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
