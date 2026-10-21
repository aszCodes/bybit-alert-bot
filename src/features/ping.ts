import type { Feature } from "../core/command.js";

export const pingFeature: Feature = {
  title: "Misc",
  help: ["`!ping` checks the bot is alive"],
  commands: [
    {
      name: "!ping",
      run: async ({ msg }) => {
        await msg.reply("pong");
      },
    },
  ],
};
