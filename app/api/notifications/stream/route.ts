import { subscribe, initStream } from "@/lib/notificationStream";
import "@/lib/mongodb";

export async function GET(req: Request) {
  initStream();

  return new Response(
    new ReadableStream({
      start(controller) {
        const unsub = subscribe((event) =>
          controller.enqueue(`data: ${JSON.stringify(event)}\n\n`)
        );

        req.signal.addEventListener("abort", () => {
          unsub();
          controller.close();
        });
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}
