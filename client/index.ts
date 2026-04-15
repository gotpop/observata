import { createShader } from "shaders/js"

const heroShaderConfig = {
  components: [
    {
      type: "Form3D",
      id: "hero_form3d",
      props: {
        center: {
          x: 0.63,
          y: 0.82,
        },
        glossiness: 200,
        lighting: 197,
        shape3d: {
          type: "ribbon",
          angle: 0,
          twist: 24,
          width: 73,
          thickness: 20,
          seed: 25,
        },
        shape3dType: "ribbon",
        speed: 2,
        zoom: 78,
      },
      children: [
        {
          type: "Swirl",
          id: "hero_swirl",
          props: {
            colorA: "#0598ce",
            colorB: "#133868",
            colorSpace: "oklab",
            detail: 1.9,
          },
        },
        {
          type: "FallingLines",
          id: "hero_falling_lines",
          props: {
            angle: 0,
            blendMode: "linearDodge",
            colorB: "#000000",
            opacity: 0.47,
            speed: 0.1,
            strokeWidth: 0.16,
            trailLength: 0.72,
            transform: {
              scale: 0.79,
            },
          },
        },
      ],
    },
    {
      type: "FilmGrain",
      id: "hero_film_grain",
      props: {
        strength: 0.32,
        visible: true,
      },
    },
  ],
}

const initHeroShaders = async () => {
  const canvases = document.querySelectorAll<HTMLCanvasElement>(".wp-block-observata-hero .hero-shader")

  if (!window.isSecureContext || !("gpu" in navigator)) {
    console.warn("Shaders need HTTPS or localhost with WebGPU support. Current origin:", window.location.origin)
    return
  }

  for (const canvas of canvases) {
    if (canvas.dataset.shaderInitialized === "true") {
      continue
    }

    canvas.dataset.shaderInitialized = "true"

    try {
      await createShader(canvas, heroShaderConfig)
    } catch (error) {
      console.error("Hero shader failed to initialize.", error)
      delete canvas.dataset.shaderInitialized
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void initHeroShaders()
  })
} else {
  void initHeroShaders()
}
