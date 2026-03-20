"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

/**
 * Shared WaterRipple scene.
 *
 * The renderer is mounted once and controlled imperatively so the
 * WebGL context can persist while sections switch between autonomous
 * and timeline-driven behavior.
 */

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec4 uRipples[8];
  uniform int uRippleCount;
  uniform vec2 uMouse;
  uniform float uMouseActive;

  varying float vElevation;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vec3 pos = position;
    float elevation = 0.0;

    float eps = 0.05;
    float hL = 0.0, hR = 0.0, hD = 0.0, hU = 0.0;

    for (int i = 0; i < 8; i++) {
      if (i >= uRippleCount) break;

      vec2 origin = uRipples[i].xy;
      float startTime = uRipples[i].z;
      float amp = uRipples[i].w;
      float age = uTime - startTime;

      if (age < 0.0 || age > 12.0) continue;

      float dist = distance(pos.xz, origin);
      float wavefront = age * 1.4;
      float behind = smoothstep(0.0, 0.3, wavefront - dist);

      float k = 8.0;
      float omega = 2.5;
      float wave = sin(dist * k - age * omega);
      wave = sign(wave) * pow(abs(wave), 0.7);

      float spatial = 1.0 / (1.0 + dist * 0.15);
      float temporal = exp(-age * 0.22);
      float h = wave * amp * spatial * temporal * behind;
      elevation += h;

      float dL = distance(pos.xz + vec2(-eps, 0.0), origin);
      float dR = distance(pos.xz + vec2(eps, 0.0), origin);
      float dD = distance(pos.xz + vec2(0.0, -eps), origin);
      float dU = distance(pos.xz + vec2(0.0, eps), origin);

      float bL = smoothstep(0.0, 0.3, wavefront - dL);
      float bR = smoothstep(0.0, 0.3, wavefront - dR);
      float bD = smoothstep(0.0, 0.3, wavefront - dD);
      float bU = smoothstep(0.0, 0.3, wavefront - dU);

      float factor = amp * spatial * temporal;
      hL += sign(sin(dL*k - age*omega)) * pow(abs(sin(dL*k - age*omega)), 0.7) * factor / (1.0 + dL*0.15) * bL;
      hR += sign(sin(dR*k - age*omega)) * pow(abs(sin(dR*k - age*omega)), 0.7) * factor / (1.0 + dR*0.15) * bR;
      hD += sign(sin(dD*k - age*omega)) * pow(abs(sin(dD*k - age*omega)), 0.7) * factor / (1.0 + dD*0.15) * bD;
      hU += sign(sin(dU*k - age*omega)) * pow(abs(sin(dU*k - age*omega)), 0.7) * factor / (1.0 + dU*0.15) * bU;
    }

    float mDist = distance(pos.xz, uMouse);
    float mWave = sin(mDist * 14.0 - uTime * 4.0);
    float mEffect = mWave * 0.008 * exp(-mDist * 1.0) * uMouseActive;
    elevation += mEffect;

    elevation += sin(pos.x * 2.0 + uTime * 0.5) * cos(pos.z * 1.8 + uTime * 0.4) * 0.002;

    pos.y += elevation;
    vElevation = elevation;
    vWorldPos = pos;

    vec3 tangentX = normalize(vec3(2.0 * eps, hR - hL, 0.0));
    vec3 tangentZ = normalize(vec3(0.0, hU - hD, 2.0 * eps));
    vNormal = normalize(cross(tangentZ, tangentX));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying float vElevation;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  uniform float uTime;
  uniform vec4 uRipples[8];
  uniform int uRippleCount;

  void main() {
    vec3 normal = normalize(vNormal);

    vec3 viewPos = vec3(0.0, 0.6, 6.0);
    vec3 viewDir = normalize(viewPos - vWorldPos);

    vec3 deepColor = vec3(0.02, 0.02, 0.025);
    vec3 surfaceColor = vec3(0.06, 0.06, 0.07);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    vec3 reflected = reflect(-viewDir, normal);
    float envY = reflected.y * 0.5 + 0.5;
    vec3 envColor = mix(vec3(0.02, 0.02, 0.025), vec3(0.15, 0.14, 0.13), smoothstep(0.3, 0.9, envY));

    vec3 lightDir = normalize(vec3(0.2, 1.0, 0.3));
    float diffuse = max(dot(normal, lightDir), 0.0);

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 200.0);

    vec3 rimLight = normalize(vec3(-0.3, 0.5, -1.0));
    vec3 rimHalf = normalize(rimLight + viewDir);
    float rimSpec = pow(max(dot(normal, rimHalf), 0.0), 120.0);

    vec3 color = mix(deepColor, surfaceColor, diffuse * 0.5);
    color = mix(color, envColor, fresnel * 0.6);
    color += vec3(0.9, 0.85, 0.8) * spec * 0.8;
    color += vec3(0.7, 0.7, 0.75) * rimSpec * 0.3;

    vec3 amber = vec3(0.96, 0.75, 0.15);
    float peakGlow = smoothstep(0.02, 0.06, vElevation);
    color += amber * peakGlow * 0.04;

    for (int i = 0; i < 8; i++) {
      if (i >= uRippleCount) break;
      vec2 origin = uRipples[i].xy;
      float startTime = uRipples[i].z;
      float age = uTime - startTime;
      if (age < 0.0 || age > 4.0) continue;
      float dist = distance(vWorldPos.xz, origin);
      float intensity = exp(-age * 1.2);
      float core = exp(-dist * dist * 8.0) * intensity;
      float halo = exp(-dist * dist * 1.5) * intensity * 0.4;
      vec3 glowColor = mix(vec3(1.0, 0.95, 0.85), amber, 0.3);
      color += glowColor * core * 1.5;
      color += amber * halo * 0.6;
    }

    float edgeDist = length(vWorldPos.xz) / 7.0;
    float edgeFade = 1.0 - smoothstep(0.5, 1.0, edgeDist);
    color *= mix(0.7, 1.0, 1.0 - edgeDist * 0.3);

    gl_FragColor = vec4(color, edgeFade * 0.9);
  }
`;

const DROP_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const DROP_FRAGMENT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float facing = max(dot(vNormal, vViewDir), 0.0);
    float rim = 1.0 - facing;
    float glow = pow(rim, 2.5);

    vec3 coreColor = vec3(1.0, 0.98, 0.92);
    vec3 midColor = vec3(0.98, 0.83, 0.4);
    vec3 edgeColor = vec3(0.96, 0.62, 0.04);
    vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.5, rim));
    color = mix(color, edgeColor, smoothstep(0.4, 1.0, rim));

    float highlight = pow(facing, 4.0);
    color += vec3(0.6, 0.5, 0.3) * highlight;

    float alpha = 0.8 + glow * 0.2;
    gl_FragColor = vec4(color, alpha);
  }
`;

type CameraPreset = {
  distance: number;
  height: number;
  targetY: number;
};

interface Ripple {
  amplitude: number;
  time: number;
  x: number;
  z: number;
}

interface Drop {
  id: number;
  amplitude: number;
  fallDuration: number;
  rippleTime: number;
  startTime: number;
  startY: number;
  x: number;
  z: number;
}

type DropState = {
  visible: boolean;
  x: number;
  y: number;
  z: number;
};

export type WaterRippleMode = "auto" | "timeline";

export interface WaterRippleHandle {
  clearScrollDrop: () => void;
  setMode: (mode: WaterRippleMode) => void;
  setScrollDrop: (y: number, visible: boolean, x?: number, z?: number) => void;
  triggerRipple: (x?: number, z?: number, amplitude?: number) => void;
}

const AUTO_CAMERA: CameraPreset = {
  distance: 6,
  height: 0.6,
  targetY: -0.1,
};

const TIMELINE_CAMERA: CameraPreset = {
  distance: 3.65,
  height: 0.32,
  targetY: -0.14,
};

const HOME_DROP: DropState = {
  visible: false,
  x: 0,
  y: 2.2,
  z: -1,
};

const AUTO_DROP_DELAY = {
  max: 12,
  min: 10,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const WaterRipple = forwardRef<WaterRippleHandle>(function WaterRipple(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ active: 0, x: 0, z: 0 });
  const ripplesRef = useRef<Ripple[]>([]);
  const dropsRef = useRef<Drop[]>([]);
  const clockRef = useRef<THREE.Timer | null>(null);
  const modeRef = useRef<WaterRippleMode>("auto");
  const timelineDropRef = useRef<DropState>(HOME_DROP);
  const nextAutoDropAtRef = useRef(0.4);

  function pushRipple(x = 0, z = -1, amplitude = 0.12, time = clockRef.current?.getElapsed() ?? 0) {
    ripplesRef.current.push({
      amplitude,
      time,
      x,
      z,
    });

    if (ripplesRef.current.length > 8) {
      ripplesRef.current.shift();
    }
  }

  useImperativeHandle(ref, () => ({
    clearScrollDrop: () => {
      timelineDropRef.current = { ...HOME_DROP };
    },
    setMode: (mode) => {
      if (modeRef.current === mode) return;
      modeRef.current = mode;

      if (mode === "auto") {
        timelineDropRef.current = { ...HOME_DROP };
        const clock = clockRef.current;
        if (clock) {
          nextAutoDropAtRef.current = clock.getElapsed() + 0.9;
        }
      }
    },
    setScrollDrop: (y, visible, x = 0, z = -1) => {
      timelineDropRef.current = { visible, x, y, z };
    },
    triggerRipple: (x = 0, z = -1, amplitude = 0.12) => {
      pushRipple(x, z, amplitude);
    },
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationId = 0;
    let resizeHandler: (() => void) | null = null;
    let mouseMoveHandler: ((event: MouseEvent) => void) | null = null;
    let renderer: THREE.WebGLRenderer | null = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );

    const cameraState = { ...AUTO_CAMERA };
    camera.position.set(0, cameraState.height, cameraState.distance);
    camera.lookAt(0, cameraState.targetY, 0);

    const gl = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    gl.setSize(container.clientWidth, container.clientHeight);
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setClearColor(0x000000, 0);
    container.appendChild(gl.domElement);
    renderer = gl;

    const waterGeo = new THREE.PlaneGeometry(16, 16, 200, 200);
    waterGeo.rotateX(-Math.PI / 2);

    const rippleUniforms = new Array(8)
      .fill(null)
      .map(() => new THREE.Vector4(0, 0, -100, 0));

    const waterMat = new THREE.ShaderMaterial({
      uniforms: {
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseActive: { value: 0 },
        uRippleCount: { value: 0 },
        uRipples: { value: rippleUniforms },
        uTime: { value: 0 },
      },
      depthWrite: false,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      vertexShader: VERTEX_SHADER,
    });

    const water = new THREE.Mesh(waterGeo, waterMat);
    scene.add(water);

    const dropGeo = new THREE.SphereGeometry(0.14, 32, 32);
    const dropMat = new THREE.ShaderMaterial({
      depthWrite: false,
      fragmentShader: DROP_FRAGMENT,
      transparent: true,
      vertexShader: DROP_VERTEX,
    });
    const dropMesh = new THREE.Mesh(dropGeo, dropMat);
    dropMesh.visible = false;
    scene.add(dropMesh);

    const dropLight = new THREE.PointLight(0xfbbf24, 0, 4, 2);
    scene.add(dropLight);

    const renderedDrop: DropState = { ...HOME_DROP };
    const clock = new THREE.Timer();
    let dropId = 0;
    let renderedSourceKey: string | null = null;
    clockRef.current = clock;

    function scheduleNextAutoDrop(time: number, quick = false) {
      nextAutoDropAtRef.current = quick
        ? time + 0.5
        : time + AUTO_DROP_DELAY.min + Math.random() * (AUTO_DROP_DELAY.max - AUTO_DROP_DELAY.min);
    }

    function createAutoDrop(time: number) {
      dropsRef.current.push({
        id: dropId,
        amplitude: 0.09 + Math.random() * 0.04,
        fallDuration: 1.2 + Math.random() * 0.4,
        rippleTime: -1,
        startTime: time,
        startY: 1.8 + Math.random() * 0.5,
        x: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 3 - 1,
      });
      dropId += 1;

      const latestDrop = dropsRef.current[dropsRef.current.length - 1];
      latestDrop.rippleTime = latestDrop.startTime + latestDrop.fallDuration;

      if (dropsRef.current.length > 4) {
        dropsRef.current.shift();
      }
    }

    scheduleNextAutoDrop(0, true);

    function animate() {
      if (disposed) return;

      clock.update();
      const time = clock.getElapsed();
      const uniforms = waterMat.uniforms;

      const targetCamera = modeRef.current === "timeline"
        ? TIMELINE_CAMERA
        : AUTO_CAMERA;

      cameraState.height += (targetCamera.height - cameraState.height) * 0.06;
      cameraState.distance += (targetCamera.distance - cameraState.distance) * 0.06;
      cameraState.targetY += (targetCamera.targetY - cameraState.targetY) * 0.06;
      camera.position.set(0, cameraState.height, cameraState.distance);
      camera.lookAt(0, cameraState.targetY, 0);

      if (modeRef.current === "auto" && time >= nextAutoDropAtRef.current) {
        createAutoDrop(time);
        scheduleNextAutoDrop(time);
      }

      let desiredVisible = false;
      let desiredX = renderedDrop.x;
      let desiredY = renderedDrop.y;
      let desiredZ = renderedDrop.z;
      let desiredLight = 0;
      let sourceKey: string | null = null;

      if (modeRef.current === "timeline" && timelineDropRef.current.visible) {
        desiredVisible = true;
        desiredX = timelineDropRef.current.x;
        desiredY = timelineDropRef.current.y;
        desiredZ = timelineDropRef.current.z;
        const proximity = 1 - Math.min(timelineDropRef.current.y / 1.8, 1);
        desiredLight = 2.2 + 3.3 * proximity;
        sourceKey = "timeline";
      } else {
        let activeDrop: Drop | null = null;

        for (const drop of dropsRef.current) {
          const age = time - drop.startTime;
          if (age >= drop.fallDuration && drop.rippleTime > 0) {
            pushRipple(drop.x, drop.z, drop.amplitude, time);
            drop.rippleTime = -1;
          }
        }

        for (let index = dropsRef.current.length - 1; index >= 0; index -= 1) {
          const drop = dropsRef.current[index];
          const age = time - drop.startTime;
          if (age >= 0 && age < drop.fallDuration) {
            activeDrop = drop;
            break;
          }
        }

        dropsRef.current = dropsRef.current.filter((drop) => (
          time - drop.startTime < drop.fallDuration + 0.25 || drop.rippleTime > 0
        ));

        if (activeDrop) {
          const age = time - activeDrop.startTime;
          const progress = clamp(age / activeDrop.fallDuration, 0, 1);
          const eased = progress * progress;
          desiredVisible = true;
          desiredX = activeDrop.x;
          desiredY = activeDrop.startY * (1 - eased);
          desiredZ = activeDrop.z;
          desiredLight = 4.0 * (1 - progress * 0.3);
          sourceKey = `auto:${activeDrop.id}`;

          // Treat each autonomous cycle as a fresh droplet so it always
          // appears to fall from above instead of traveling diagonally
          // from the previous impact point.
          if (renderedSourceKey !== sourceKey) {
            renderedDrop.x = activeDrop.x;
            renderedDrop.y = activeDrop.startY;
            renderedDrop.z = activeDrop.z;
          }
        }
      }

      if (desiredVisible) {
        renderedSourceKey = sourceKey;
        renderedDrop.visible = true;
        renderedDrop.x += (desiredX - renderedDrop.x) * 0.16;
        renderedDrop.y += (desiredY - renderedDrop.y) * 0.14;
        renderedDrop.z += (desiredZ - renderedDrop.z) * 0.16;

        dropMesh.position.set(renderedDrop.x, renderedDrop.y, renderedDrop.z);
        dropMesh.visible = true;

        dropLight.position.set(renderedDrop.x, renderedDrop.y, renderedDrop.z);
        dropLight.intensity += (desiredLight - dropLight.intensity) * 0.18;
      } else {
        renderedSourceKey = null;
        renderedDrop.visible = false;
        dropMesh.visible = false;
        dropLight.intensity += (0 - dropLight.intensity) * 0.22;
        if (dropLight.intensity < 0.01) {
          dropLight.intensity = 0;
        }
      }

      uniforms.uTime.value = time;
      uniforms.uRippleCount.value = ripplesRef.current.length;
      ripplesRef.current.forEach((ripple, index) => {
        rippleUniforms[index].set(
          ripple.x,
          ripple.z,
          ripple.time,
          ripple.amplitude,
        );
      });

      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.z);
      uniforms.uMouseActive.value += (mouseRef.current.active - uniforms.uMouseActive.value) * 0.05;
      mouseRef.current.active *= 0.98;

      gl.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }

    animate();

    resizeHandler = () => {
      if (disposed) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      gl.setSize(width, height);
    };
    window.addEventListener("resize", resizeHandler);

    mouseMoveHandler = (event) => {
      const rect = container.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.x = normalizedX * 4;
      mouseRef.current.z = normalizedY * 4 - 2;
      mouseRef.current.active = 1;
    };
    window.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (mouseMoveHandler) window.removeEventListener("mousemove", mouseMoveHandler);
      waterGeo.dispose();
      waterMat.dispose();
      dropGeo.dispose();
      dropMat.dispose();
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-hidden="true"
    />
  );
});

export default WaterRipple;
