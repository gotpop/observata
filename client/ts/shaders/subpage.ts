import { createShader } from "shaders/js"

const subpageShaderConfig = {
  components: [
    {
      type: "SolidColor",
      id: "idmo2wzvwvsm3qaus9m",
      props: {
        color: "#ffffff",
      },
    },
    {
      type: "Form3D",
      id: "idmmr8zyxrodm90feqn",
      props: {
        center: {
          x: 0.3085,
          y: 0.77,
        },
        glossiness: 200,
        lighting: 197,
        shape3d: {
          type: "ribbon",
          angle: 138,
          twist: 24,
          width: 73,
          thickness: 20,
          seed: 21.2,
        },
        shape3dType: "ribbon",
        speed: 0,
        zoom: 60,
      },
      children: [
        {
          type: "Swirl",
          id: "idmmr8zwtuhz62buy44",
          props: {
            colorA: "#EA5EC1",
            colorB: "#fc9b00",
            colorSpace: "oklab",
            detail: 1.9,
          },
        },
        {
          type: "FallingLines",
          id: "idmmr93vzo731cyb4y3",
          props: {
            angle: 0,
            blendMode: "linearDodge",
            colorB: "#000000",
            density: 13,
            opacity: 0.47,
            speed: 0.1,
            strokeWidth: 0.16,
            trailLength: 0.72,
            transform: {
              scale: 0.79,
              offsetX: -0.16,
            },
          },
        },
      ],
    },
    {
      type: "FilmGrain",
      id: "idmmr97z6pijyaz1v1u",
      props: {
        strength: 0.32,
        visible: true,
      },
    },
  ],
}

const initSubpageShaders = async () => {
  const canvas = document.getElementById("subpage-shader") as HTMLCanvasElement | null

  if (!canvas) return

  canvas.style.width = "1400px"
  canvas.style.height = "900px"

  if (!window.isSecureContext || !("gpu" in navigator)) {
    console.warn("Shaders need HTTPS or localhost with WebGPU support. Current origin:", window.location.origin)
    return
  }

  if (canvas.dataset.shaderInitialized === "true") {
    return
  }

  canvas.dataset.shaderInitialized = "true"

  try {
    await createShader(canvas, subpageShaderConfig)
  } catch (error) {
    console.error("Subpage shader failed to initialize.", error)
    delete canvas.dataset.shaderInitialized
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void initSubpageShaders()
  })
} else {
  void initSubpageShaders()
}
