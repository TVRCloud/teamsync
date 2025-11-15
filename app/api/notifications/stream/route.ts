import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";

export const GET = async () => {
  await connectDB();

  const changeStream = Notification.watch([], {
    fullDocument: "updateLookup",
  });

  const stream = new ReadableStream({
    start(controller) {
      changeStream.on("change", (change) => {
        controller.enqueue(`data: ${JSON.stringify(change.fullDocument)}\n\n`);
      });

      changeStream.on("error", (err) => {
        console.error("ChangeStream error:", err);
        controller.close();
      });
    },

    cancel() {
      changeStream.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
