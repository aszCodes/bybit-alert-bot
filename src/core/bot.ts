import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { config } from "../config.js";
import type { App, Command, Feature } from "./command.js";

export async function startBot(features: readonly Feature[]): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel], // required to receive DMs
  });

  const app: App = {
    features,
    notify: async (text) => {
      const owner = await client.users.fetch(config.ownerId);
      await owner.send(text);
    },
  };

  // Build the command lookup table from every feature
  const commands = new Map<string, Command>();
  for (const feature of features) {
    for (const command of feature.commands) {
      for (const name of [command.name, ...(command.aliases ?? [])]) {
        commands.set(name.toLowerCase(), command);
      }
    }
  }

  client.once(Events.ClientReady, async (c) => {
    console.log(`Logged in as ${c.user.tag}`);
    for (const feature of features) await feature.init?.(app);
  });

  client.on(Events.MessageCreate, async (msg) => {
    // Ignore bots, other users, and anything that isn't a DM
    if (msg.author.bot || msg.author.id !== config.ownerId || msg.guild) return;

    const content = msg.content.trim();
    const [name = "", ...args] = content.split(/\s+/);
    const command = commands.get(name.toLowerCase());
    if (!command) return;

    try {
      await command.run({ msg, args, rest: content.slice(name.length).trim(), app });
    } catch (err) {
      console.error(err);
      await msg.reply("Something went wrong, check the console.");
    }
  });

  await client.login(config.discordToken);
}
