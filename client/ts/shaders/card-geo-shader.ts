import { createShader } from "shaders/js"

const cardGeoShaderConfig = {
  components: [
    {
      type: "Form3D",
      id: "idmmr8zyxrodm90feqn",
      props: {
        // center: {
        //   x: -1.8,
        //   y: 0.23,
        // },
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
        speed: 0,
        transform: {
          offsetX: -0.15,
          rotation: 73,
          scale: 1.37,
          anchorX: 0.65,
          anchorY: 0.15,
        },
        zoom: 91,
      },
      children: [
        {
          type: "Swirl",
          id: "idmmr8zwtuhz62buy44",
          props: {
            colorA: "#0598ce",
            colorB: "#133868",
            colorSpace: "oklab",
            detail: 1.9,
            visible: true,
          },
        },
        {
          type: "FallingLines",
          id: "idmmr93vzo731cyb4y3",
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
              offsetX: 0.21,
            },
          },
        },
      ],
    },
    {
      type: "FilmGrain",
      id: "idmmr97z6pijyaz1v1u",
      props: {
        opacity: 0.32,
        strength: 0.32,
        visible: true,
      },
    },
  ],
}

export async function initCardGeoShader(canvas: HTMLCanvasElement) {
  canvas.style.width = "214px"
  canvas.style.height = "214px"

  return createShader(canvas, cardGeoShaderConfig)
}
