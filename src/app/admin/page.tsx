import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

// Initialize Supabase correctly avoiding build crashes if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Types
type VisitRow = {
  id: string;
  ip: string;
  user_agent: string;
  device: string;
  os: string;
  browser: string;
  phone_model: string | null;
  referrer: string;
  page: string;
  country: string;
  city: string;
  timestamp: string;
};

// Handle Authentication POST for the simple password layer
export async function authenticate(formData: FormData) {
  "use server";
  const password = formData.get("password");
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", { path: "/" });
    redirect("/admin");
  }
}

// Log out action
export async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  redirect("/");
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";

  // 1. Password Protection View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4">
        <form
          action={authenticate}
          className="border border-zinc-800 bg-zinc-950 p-8 rounded-xl flex flex-col items-center gap-6 shadow-2xl w-full max-w-sm"
        >
          <h1 className="text-xl font-bold tracking-widest text-zinc-100">&gt; ROOT_ACCESS</h1>
          <input
            type="password"
            name="password"
            autoFocus
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
            placeholder="[ ENTER PASSWORD ]"
          />
          <button
            type="submit"
            className="w-full bg-zinc-100 text-black font-semibold py-2 rounded hover:bg-green-400 transition-colors"
          >
            DECRYPT
          </button>
        </form>
      </div>
    );
  }

  // 2. Fetch Dashboard Data
  let visits: VisitRow[] = [];
  let fetchError = null;

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      visits = data || [];
    } else {
      fetchError = "Supabase environment variables are missing.";
    }
  } catch (err: any) {
    fetchError = err.message || "Failed to fetch telemetry data.";
  }

  // 3. Admin Dashboard View
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-widest">&gt; TELEMETRY_STREAM</h1>
            <p className="text-sm text-zinc-500 mt-1">Live tracking visualizer (Last 100 entries)</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs px-4 py-2 bg-red-950/30 text-red-500 border border-red-900/50 rounded hover:bg-red-900/50 hover:text-red-400 transition-colors"
            >
              TERMINATE_SESSION
            </button>
          </form>
        </div>

        {/* Error State */}
        {fetchError && (
          <div className="bg-red-950/20 border border-red-900/50 text-red-400 p-4 rounded-lg flex items-center gap-3">
            <span className="font-bold">CRITICAL_ERROR:</span> {fetchError}
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-950 shadow-2xl w-full">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-zinc-900/50 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium border-b border-zinc-800">TIMESTAMP (UTC)</th>
                <th className="px-4 py-3 font-medium border-b border-zinc-800">IP ADDRESS</th>
                <th className="px-4 py-3 font-medium border-b border-zinc-800">LOCATION</th>
                <th className="px-4 py-3 font-medium border-b border-zinc-800">DEVICE / BROWSER</th>
                <th className="px-4 py-3 font-medium border-b border-zinc-800">PHONE MODEL</th>
                <th className="px-4 py-3 font-medium border-b border-zinc-800">PAGE</th>
                <th className="px-4 py-3 font-medium border-b border-zinc-800">REFERRER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {visits.length === 0 && !fetchError && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                    No telemetry sequence detected. Awaiting initialization.
                  </td>
                </tr>
              )}
              {visits.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(row.timestamp).toLocaleString("en-US", { 
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
                    })}
                  </td>
                  <td className="px-4 py-3 text-emerald-400 font-medium">{row.ip}</td>
                  <td className="px-4 py-3">
                    {row.city}, {row.country}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-200">{row.device} / {row.os}</span>
                      <span className="text-zinc-500 text-[10px]">{row.browser}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cyan-400">
                    {row.phone_model || <span className="text-zinc-700">-</span>}
                  </td>
                  <td className="px-4 py-3 text-indigo-300">{row.page}</td>
                  <td className="px-4 py-3 text-pink-400 max-w-[150px] truncate" title={row.referrer}>
                    {row.referrer === "direct" ? <span className="text-zinc-600">DIRECT</span> : row.referrer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
