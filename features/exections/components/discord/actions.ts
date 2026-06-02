"use server";

export type DiscordToken = {
  token: string;
};

export async function fetchDiscordRealtimeToken(): Promise<DiscordToken> {
  return {
    token: "",
  };
}