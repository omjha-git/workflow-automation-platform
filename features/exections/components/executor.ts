import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "@/features/exections/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.endpoint) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError(
      "HTTP Request node: No endpoint configured"
    );
  }

  if (!data.method) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError(
      "HTTP Request node: Method not configured"
    );
  }

  if (!data.variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError(
      "HTTP Request node: Variable name not configured"
    );
  }

  const endpointTemplate = data.endpoint;
  const method = data.method;
  const variableName = data.variableName;
  const bodyTemplate = data.body;

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(endpointTemplate)(context);

    const options: KyOptions = {
      method,
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolvedBody = Handlebars.compile(
        bodyTemplate || "{}"
      )(context);

      JSON.parse(resolvedBody);

      options.body = resolvedBody;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);

    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    };
  });

  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "success",
    })
  );

  return {
    ...context,
    [variableName]: result,
  };
};