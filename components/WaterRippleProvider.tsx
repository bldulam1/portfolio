"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import WaterRipple, {
  type WaterRippleHandle,
  type WaterRippleMode,
} from "./WaterRipple";

interface WaterRippleController {
  clearTimelineDrop: () => void;
  setMode: (mode: WaterRippleMode) => void;
  setTimelineDrop: (y: number, visible: boolean, x?: number, z?: number) => void;
  triggerRipple: (x?: number, z?: number, amplitude?: number) => void;
}

const WaterRippleContext = createContext<WaterRippleController | null>(null);

export function WaterRippleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const rippleRef = useRef<WaterRippleHandle>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    rippleRef.current?.setMode("auto");
    rippleRef.current?.clearScrollDrop();
  }, [pathname]);

  const controller: WaterRippleController = {
    clearTimelineDrop: () => {
      rippleRef.current?.clearScrollDrop();
    },
    setMode: (mode) => {
      rippleRef.current?.setMode(mode);
    },
    setTimelineDrop: (y, visible, x = 0, z = -1) => {
      rippleRef.current?.setMode("timeline");
      rippleRef.current?.setScrollDrop(y, visible, x, z);
    },
    triggerRipple: (x = 0, z = -1, amplitude = 0.12) => {
      rippleRef.current?.triggerRipple(x, z, amplitude);
    },
  };

  return (
    <WaterRippleContext.Provider value={controller}>
      <div className="relative z-10">{children}</div>

      <div
        className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ${
          isHome ? "opacity-100" : "opacity-0"
        }`}
      >
        <WaterRipple ref={rippleRef} />
      </div>
    </WaterRippleContext.Provider>
  );
}

export function useWaterRippleController() {
  const context = useContext(WaterRippleContext);

  if (!context) {
    throw new Error("useWaterRippleController must be used within WaterRippleProvider");
  }

  return context;
}
