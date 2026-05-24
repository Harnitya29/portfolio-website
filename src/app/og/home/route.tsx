import { ImageResponse } from "next/og";

export const runtime = "edge";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource && resource[1]) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(request: Request) {
  // Load fonts
  const fontData = await loadGoogleFont("Geist+Mono", "harnity@onldecvspbx,.");
  const fontDataBold = await loadGoogleFont("Geist+Mono:wght@700", "harnitya");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030308",
          fontFamily: "Geist Mono",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Deep space cosmic glow */}
        <div
          style={{
            position: "absolute",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123, 110, 246, 0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(60px)",
          }}
        />

        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(123, 110, 246, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(123, 110, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating abstract elements */}
        <div style={{ position: "absolute", top: "15%", left: "20%", display: "flex", flexDirection: "column", opacity: 0.3 }}>
          <span style={{ color: "#5eead4", fontSize: 14 }}>[ SATELLITE_LINK_ACTIVE ]</span>
          <span style={{ color: "#7B6EF6", fontSize: 14 }}>sys.conn.stable</span>
        </div>

        {/* Main Identity Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "50px",
            background: "rgba(10, 10, 18, 0.7)",
            border: "1px solid rgba(123, 110, 246, 0.3)",
            borderRadius: "24px",
            boxShadow: "0 0 40px rgba(123, 110, 246, 0.1)",
            width: "850px",
            position: "relative",
          }}
        >
          {/* Card subtle glowing border top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(123, 110, 246, 0.8), transparent)",
            }}
          />

          {/* Profile Image */}
          <div
            style={{
              display: "flex",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border: "2px solid rgba(123, 110, 246, 0.5)",
              padding: "8px",
              marginRight: "50px",
              background: "rgba(123, 110, 246, 0.05)",
            }}
          >
            <img
              src="https://harnitya.in/cc.jpg"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Info Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: 64,
                fontWeight: "bold",
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.05em",
              }}
            >
              harnitya
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "12px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  color: "#a78bfa",
                  marginRight: "20px",
                }}
              >
                @harnitya
              </span>
              
              {/* Online Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  background: "rgba(123, 110, 246, 0.1)",
                  border: "1px solid rgba(123, 110, 246, 0.3)",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#a78bfa",
                    marginRight: "10px",
                    boxShadow: "0 0 10px #a78bfa",
                  }}
                />
                <span style={{ color: "#a78bfa", fontSize: 18 }}>online</span>
              </div>
            </div>

            <p
              style={{
                fontSize: 26,
                color: "#9ca3af",
                margin: 0,
                lineHeight: 1.4,
                maxWidth: "500px",
              }}
            >
              decoding the space between syntax, systems, and consciousness.
            </p>
          </div>
        </div>
        
        {/* Bottom subtle text */}
        <div style={{ position: "absolute", bottom: "40px", display: "flex", alignItems: "center", opacity: 0.5 }}>
          <span style={{ color: "#ffffff", fontSize: 18, letterSpacing: "0.2em" }}>HARNITYA.IN</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist Mono",
          data: fontData,
          style: "normal",
        },
        {
          name: "Geist Mono",
          data: fontDataBold,
          style: "normal",
          weight: 700,
        }
      ],
    }
  );
}