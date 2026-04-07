"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

function registerPlugins() {
  if (registered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function useGsapPlugins() {
  useEffect(() => {
    registerPlugins();
  }, []);
}
