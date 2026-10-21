# Bybit Alert Bot

A personal Discord bot for tracking pairs. DM it to check prices and set price alerts, and it DMs you back when a level is hit.

## Run it

```bash
npm install
```

Create `.env`:

```
DISCORD_TOKEN=your_bot_token
OWNER_ID=your_discord_user_id
```

```bash
npm run dev
```

Create an app and enable **Message Content Intent** in the Discord Developer Portal, and add the bot to a server you share so you can DM it.

## Commands

| Command                          | Description                               |
| -------------------------------- | ----------------------------------------- |
| `!price [symbols]`               | Prices for your watchlist, or any symbols |
| `!watch add/remove <symbols>`    | Manage the watchlist                      |
| `!alert btc 70000`               | One-time alert                            |
| `!alert btc 70000 repeat "note"` | Repeating alert with a note               |
| `!alerts` / `!delalert <id>`     | List / delete alerts                      |
| `!help`                          | Show all commands                         |

## Structure

```
src/
  core/       command router, types, storage
  bybit/      REST + WebSocket clients
  features/   price, watchlist, alerts, help, ping
```

Not affiliated with Bybit. Sends notifications only, doesn't place trades.
