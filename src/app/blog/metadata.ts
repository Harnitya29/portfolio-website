import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dive into Harnitya's thoughts, ideas, and stories on technology, design, and creativity.",
  openGraph: {
    title: "Blog",
    description: "Dive into Harnitya's thoughts, ideas, and stories on technology, design, and creativity.",
    url: "https://harnitya.in/blog",
    images: [
      {
        url: "https://harnitya.in/og/home?title=blog",
      },
    ],
  },
  twitter: {
    title: "Blog",
    description: "Dive into Harnitya's thoughts, ideas, and stories on technology, design, and creativity.",
    card: "summary_large_image",
    creator: "@harnitya29",
    images: ["https://harnitya.in/og/home?title=blog"],
  },
};
