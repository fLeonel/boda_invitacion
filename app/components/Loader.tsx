"use client";

import { useEffect } from "react";
import type { HTMLAttributes } from "react";

type ModelViewerProps = HTMLAttributes<HTMLElement> & {
  src?: string;
  "auto-rotate"?: boolean;
  "auto-rotate-delay"?: string;
  "rotation-per-second"?: string;
  "camera-controls"?: boolean;
  "disable-zoom"?: boolean;
  exposure?: string;
  "shadow-intensity"?: string;
  "environment-image"?: string;
  "camera-orbit"?: string;
  "camera-target"?: string;
};

const ModelViewer = "model-viewer" as unknown as React.FC<ModelViewerProps>;

export default function Loader() {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <div className="loader-container">
      <ModelViewer
        src="/3dring.glb"
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="6deg"
        camera-controls
        disable-zoom
        exposure="1.3"
        shadow-intensity="1"
        environment-image="neutral"
        camera-orbit="30deg 70deg 3m"
        camera-target="0m 0m 0m"
        style={{ width: "200px", height: "200px" }}
      />
    </div>
  );
}
