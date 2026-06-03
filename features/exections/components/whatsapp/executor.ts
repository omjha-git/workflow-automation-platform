import Handlebars from "handlebars";
import { decode } from "html-entities";
import ky, { HTTPError } from "ky";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "../../types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

export type WhatsAppData = {
  variableName?: string;
  accessToken?: string;
  phoneNumberId?: string;
  to?: string;
  message?: string;
};

export const whatsappExecutor: NodeExecutor<WhatsAppData> =
  async ({ data, context }) => {
    console.log("=== WHATSAPP EXECUTOR STARTED ===");
    console.log("WhatsApp data:", {
      variableName: data.variableName,
      phoneNumberId: data.phoneNumberId,
      to: data.to,
      hasAccessToken: Boolean(data.accessToken),
      message: data.message,
    });

    if (!data.accessToken) {
      throw new NonRetriableError("WhatsApp node: Access token is required");
    }

    if (!data.phoneNumberId) {
      throw new NonRetriableError("WhatsApp node: Phone Number ID is required");
    }

    if (!data.to) {
      throw new NonRetriableError("WhatsApp node: Recipient number is required");
    }

    if (!data.message) {
      throw new NonRetriableError("WhatsApp node: Message is required");
    }

    const to = data.to.replace(/\D/g, "");

    const message = decode(
      Handlebars.compile(data.message)(context)
    ).slice(0, 4000);

    console.log("WhatsApp sending to:", to);
    console.log("WhatsApp message:", message);

    try {
      const response = await ky.post(
        `https://graph.facebook.com/v20.0/${data.phoneNumberId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
          json: {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: {
              body: message,
            },
          },
        }
      );

      const result = await response.json();

      console.log("WhatsApp response status:", response.status);
      console.log("WhatsApp response body:", result);

      const variableName = data.variableName || "whatsapp";

      return {
        ...context,
        [variableName]: {
          sent: true,
          to,
          message,
          result,
        },
      };
    } catch (error) {
      console.log("=== WHATSAPP ERROR ===");

      if (error instanceof HTTPError) {
        let errorMessage = error.message;
        let errorBody: unknown = null;

        try {
          errorBody = await error.response.json();
          console.log("WhatsApp error status:", error.response.status);
          console.log("WhatsApp error body:", errorBody);

          if (
            typeof errorBody === "object" &&
            errorBody !== null &&
            "error" in errorBody
          ) {
            const body = errorBody as {
              error?: {
                message?: string;
                code?: number;
                type?: string;
                fbtrace_id?: string;
              };
            };

            errorMessage = body.error?.message || errorMessage;
          }
        } catch {
          console.log("Could not read WhatsApp error body");
        }

        throw new NonRetriableError(
          `WhatsApp API Error: ${errorMessage}`
        );
      }

      console.log(error);
      throw error;
    }
  };