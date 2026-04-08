"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type HeroObjectType = "sphere" | "torus" | "cube";

function createMainObject(objectType: HeroObjectType) {
  if (objectType === "torus") {
    return new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.35, 140, 20),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true }),
    );
  }

  if (objectType === "cube") {
    return new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.2, 2.2, 10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true }),
    );
  }

  return new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.8, 2),
    new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true }),
  );
}

export default function HeroScene({
  objectType = "torus",
}: {
  objectType?: HeroObjectType;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallback] = useState(
    typeof navigator !== "undefined" && navigator.hardwareConcurrency < 4,
  );
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const shouldFallback = fallback || webglUnavailable;

  useEffect(() => {
    if (shouldFallback) {
      return;
    }

    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 6;

    const probeCanvas = document.createElement("canvas");
    const hasWebglContext =
      !!window.WebGLRenderingContext &&
      !!(
        probeCanvas.getContext("webgl2") ||
        probeCanvas.getContext("webgl") ||
        probeCanvas.getContext("experimental-webgl")
      );

    if (!hasWebglContext) {
      setWebglUnavailable(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      console.warn("HeroScene disabled: WebGL context unavailable", error);
      setWebglUnavailable(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const mainObject = createMainObject(objectType);
    scene.add(mainObject);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x60a5fa,
        size: 0.04,
        transparent: true,
        opacity: 0.65,
      }),
    );
    scene.add(particles);

    let animationFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;

    const scrollState = {
      objectY: 0,
      objectRotationX: 0,
      objectRotationY: 0,
      particleY: 0,
    };

    const scrollTween = gsap.to(scrollState, {
      objectY: -2.2,
      objectRotationX: Math.PI * 0.55,
      objectRotationY: Math.PI * 0.9,
      particleY: -1.2,
      ease: "none",
      scrollTrigger: {
        trigger: mount,
        start: "top top",
        end: "+=1800",
        scrub: 1,
      },
    });

    const onPointerMove = (event: PointerEvent) => {
      pointerX = ((event.clientX / window.innerWidth) * 2 - 1) * 0.25;
      pointerY = ((event.clientY / window.innerHeight) * 2 - 1) * 0.25;
    };

    const onResize = () => {
      if (!mountRef.current) {
        return;
      }
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );
    };

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      mainObject.rotation.x += 0.0015;
      mainObject.rotation.y += 0.003;
      mainObject.position.y = scrollState.objectY;
      mainObject.rotation.x += scrollState.objectRotationX * 0.005;
      mainObject.rotation.y += scrollState.objectRotationY * 0.005;

      particles.rotation.y -= 0.0007;
      particles.position.y = scrollState.particleY;
      currentX += (pointerX - currentX) * 0.05;
      currentY += (pointerY - currentY) * 0.05;
      mainObject.position.x = -currentX * 0.45;
      mainObject.position.y = scrollState.objectY + currentY * 0.35;
      camera.position.x = currentX;
      camera.position.y = -currentY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      scrollTween.kill();
      renderer.dispose();
      mainObject.geometry.dispose();
      (mainObject.material as THREE.Material).dispose();
      particleGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [objectType, shouldFallback]);

  if (shouldFallback) {
    return (
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.3),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.25),transparent_35%)]" />
    );
  }

  return (
    <div ref={mountRef} className="pointer-events-none absolute inset-0" />
  );
}
