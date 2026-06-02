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
    if (!data.accessToken) {
      throw new NonRetriableError(
        "WhatsApp node: Access token is required"
      );
    }

    if (!data.phoneNumberId) {
      throw new NonRetriableError(
        "WhatsApp node: Phone Number ID is required"
      );
    }

    if (!data.to) {
      throw new NonRetriableError(
        "WhatsApp node: Recipient number is required"
      );
    }

    if (!data.message) {
      throw new NonRetriableError(
        "WhatsApp node: Message is required"
      );
    }

    const to = data.to.replace(/\D/g, "");

    const message = decode(
      Handlebars.compile(data.message)(context)
    ).slice(0, 4000);

    try {
      const result = await ky
        .post(
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
        )
        .json();

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
      if (error instanceof HTTPError) {
        let errorMessage = error.message;

        try {
          const errorBody = await error.response.json() as {
            error?: {
              message?: string;
            };
          };

          errorMessage =
            errorBody.error?.message || errorMessage;
        } catch {
          // body already read or not JSON
        }

        throw new NonRetriableError(
          `WhatsApp API Error: ${errorMessage}`
        );
      }

      throw error;
    }
  };