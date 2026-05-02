import "./shaders/home"
import "./shaders/subpage"

import { initCardGeoShader } from "./shaders/card-geo-shader"

document.addEventListener("DOMContentLoaded", () => {
  const canvases = document.querySelectorAll<HTMLCanvasElement>(".card-geo-shader canvas")
  for (const canvas of canvases) {
    void initCardGeoShader(canvas)
  }
})
