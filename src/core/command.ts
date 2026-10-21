import type { Message } from "discord.js";

/** Shared services every feature can use. */
export interface App {
  /** DM the owner. */
  notify(text: string): Promise<void>;
  /** All registered features (used by !help). */
  features: readonly Feature[];
}

export interface CommandContext {
  msg: Message;
  /** Whitespace-split arguments after the command name. */
  args: string[];
  /** Raw text after the command name (keeps spacing and quotes). */
  rest: string;
  app: App;
}

export interface Command {
  /** Including the prefix, e.g. "!price". */
  name: string;
  aliases?: string[];
  run(ctx: CommandContext): Promise<void>;
}

/** A feature bundles related commands, their help text, and optional startup logic. */
export interface Feature {
  /** Section title in !help. Features with the same title are grouped. */
  title: string;
  /** Lines shown in !help. */
  help: string[];
  commands: Command[];
  /** Runs once when the bot is ready. */
  init?(app: App): void | Promise<void>;
}
