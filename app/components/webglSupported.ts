"use client";

export function webglSupported(kind: "webgl" | "webgl2" = "webgl2") {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext(kind) ||
      canvas.getContext(kind === "webgl2" ? "webgl" : "experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}
