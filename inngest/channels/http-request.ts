import { channel, topic } from "@inngest/realtime";

export type HttpRequestStatus =
  | "loading"
  | "success"
  | "error";

export const httpRequestChannel = channel("http-request-execution")
  .addTopic(
    topic("status").type<{
      nodeId: string;
      status: HttpRequestStatus;
    }>()
  );