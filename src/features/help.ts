import type { Feature } from "../core/command.js";

export const helpFeature: Feature = {
  title: "Misc",
  help: ["`!help` shows this message"],
  commands: [
    {
      name: "!help",
      run: async ({ msg, app }) => {
        // Group help lines by feature title, in registration order
        const sections = new Map<string, string[]>();
        for (const feature of app.features) {
          const lines = sections.get(feature.title) ?? [];
          sections.set(feature.title, [...lines, ...feature.help]);
        }
        const text = [...sections]
          .map(([title, lines]) => `**${title}**\n${lines.join("\n")}`)
          .join("\n\n");
        await msg.reply(text);
      },
    },
  ],
};
