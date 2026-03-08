"use client";

import TheArchive from '~/components/TheArchive';
import dynamic from 'next/dynamic';

const NavBar = dynamic(() => import("~/components/NavBar"), { ssr: false });

export default function ArchivePage() {
  return (
    <main className="relative flex min-h-screen flex-col text-white p-8 md:p-16 lg:p-24 max-w-3xl mx-auto">
      {/* Background styling matching main page */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.1),rgba(0,0,0,0)_50%)]" />
      </div>

      <div className="mt-8 mb-32">
        <TheArchive />
      </div>

      <NavBar />
    </main>
  );
}
