import { Server as HTTPServer } from "http";
import { NextResponse } from "next/server";
import { initSocketServer } from "@/lib/socket-server";

const httpServer: HTTPServer | null = null;

export async function GET() {
  // Ensure socket is initialized
  initSocketServer(httpServer as HTTPServer);
  if (!httpServer) {
    // In Next.js, we use a simpler approach - initialize on first request
    console.log("[v0] Socket.IO endpoint called for initialization");
  }

  return NextResponse.json({ status: "Socket.IO endpoint ready" });
}
