/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#333",
        padding: "40px",
      }}
    >
      <div style={{ fontSize: "64px", fontWeight: "bold" }}>NeonTek</div>
      <div style={{ fontSize: "32px", marginTop: "20px" }}>Blog</div>
    </div>,
    {
      ...size,
    },
  )
}
