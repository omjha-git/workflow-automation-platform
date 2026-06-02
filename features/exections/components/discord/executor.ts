import Handlebars from "handlebars";
import { decode } from "html-entities";
import ky from "ky";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "../../types";
import { discordChannel } from "@/inngest/channels/discord";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);

  return new Handlebars.SafeString(jsonString);
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> =
  async ({
    data,
    nodeId,
    context,
    publish,
  }) => {
    console.log("=== DISCORD EXECUTOR STARTED ===");
    console.log("Discord data:", data);

    await publish(
      discordChannel().status({
        nodeId,
        status: "loading",
      })
    );

    if (!data.webhookUrl) {
      await publish(
        discordChannel().status({
          nodeId,
          status: "error",
        })
      );

      throw new NonRetriableError(
        "Discord node: Webhook URL is required"
      );
    }

    if (!data.content) {
      await publish(
        discordChannel().status({
          nodeId,
          status: "error",
        })
      );

      throw new NonRetriableError(
        "Discord node: Message content is required"
      );
    }

    const rawContent =
      Handlebars.compile(data.content)(context);

    const content = decode(rawContent).slice(0, 2000);

    const username = data.username
      ? decode(Handlebars.compile(data.username)(context))
      : "Nodebase Bot";

    try {
      const response = await ky.post(data.webhookUrl, {
        json: {
          content,
          username,
        },
      });

      console.log("Discord response status:", response.status);
      console.log("Discord sent content:", content);

      await publish(
        discordChannel().status({
          nodeId,
          status: "success",
        })
      );

      const variableName =
        data.variableName || "discord";

      return {
        ...context,
        [variableName]: {
          messageSent: true,
          messageContent: content,
          status: response.status,
        },
      };
    } catch (error) {
      console.error("Discord webhook error:", error);

      await publish(
        discordChannel().status({
          nodeId,
          status: "error",
        })
      );

      throw error;
    }
  };