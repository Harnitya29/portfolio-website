import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dive into Harnitya's thoughts, ideas, and stories on technology, design, and creativity.",
  openGraph: {
    title: "Blog",
    description: "Dive into Harnitya's thoughts, ideas, and stories on technology, design, and creativity.",
    url: "https://harnitya.vercel.app/blog",
    images: [
      {
        url: "https://harnitya.vercel.app/og/home?title=blog",
      },
    ],
  },
  twitter: {
    title: "Blog",
    description: "Dive into Harnitya's thoughts, ideas, and stories on technology, design, and creativity.",
    card: "summary_large_image",
    creator: "@harnitya29",
    images: ["https://harnitya.vercel.app/og/home?title=blog"],
  },
};
