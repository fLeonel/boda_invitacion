"use client";

import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <div className="loader-container">
      <model-viewer
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
