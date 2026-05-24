import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos",
  description: "Photography collection by Harnitya, capturing special moments and interesting perspectives.",
  openGraph: {
    title: "Photos",
    description: "Photography collection by Harnitya, capturing special moments and interesting perspectives.",
    url: "https://harnitya.in/photos",
    images: [
      {
        url: "https://harnitya.in/og/home?title=photos",
      },
    ],
  },
  twitter: {
    title: "Photos",
    description: "Photography collection by Harnitya, capturing special moments and interesting perspectives.",
    card: "summary_large_image",
    creator: "@harnitya29",
    images: ["https://harnitya.in/og/home?title=photos"],
  },
};