import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start((ctx) => {
  const chatId = ctx.chat.id.toString();
  ctx.reply(
    `👋 Hi there! Your Chat ID is:\n\n\`${chatId}\`\n\nCopy this and paste it back into the web app to link your Telegram account.`,
    { parse_mode: "Markdown" }
  );
});

bot.launch();
