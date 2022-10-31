require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const commands = require('./js/const');
const axios = require('axios');
const api = require('./js/api');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  const username = ctx.message.from.first_name ? ctx.message.from.first_name : 'англичанин';

  ctx.reply(`Привет ${username}!\n\nНапиши мне название фильма, который ты хотел бы посмотреть:`);
});
bot.help((ctx) => ctx.reply(commands.commands));

bot.on('text', async (ctx) => {
  const message = await ctx.message.text;

  axios.get(`${api.getRequestType('SearchMovie')}/${message}`)
    .then((movies) => {
      const filmId = movies.data.results[0].id;

      axios.get(`${api.getRequestType('Trailer')}/${filmId}`).then((trailer) => {
        axios.get(`${api.getRequestType('Wikipedia')}/${filmId}`).then((wiki) => {
          const filteredFilmCaption = wiki.data.plotShort.plainText.split('.')[0];

          ctx.replyWithPhoto(
            { url: trailer.data.thumbnailUrl },
            { caption: `
              ${trailer.data.fullTitle}\n${filteredFilmCaption}
            ` }
          );
        });
      });
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
});

// bot.command('film', (ctx) => {
  
  // ctx.reply('Введите название фильма, который хотели бы посмотреть в оригинале:');
  // ctx.replyWithHTML('<b>Фильм</b>', Markup.inlineKeyboard(
  //   [
  //     [Markup.button.callback('Редакторы', 'btn_1')]
  //   ]
  // ));
// });

// bot.on('inline_query', async (ctx) => {
//   const result = [];

//   await ctx.answerInlineQuery(result);
// });

// bot.hears("Contact", (ctx) => {
//   ctx.reply("<b>?</b>", {
//     parse_mode: "HTML",
//     ...Markup.inlineKeyboard([
//       Markup.button.callback("kyky", "kyky"),
//       Markup.button.callback("mymy", "mymy")
//     ])
//   });
// });

// bot.action("kyky", (ctx) => {
//   ctx.reply("@kyky")
// })

// bot.action("mymy", (ctx) => {
//   ctx.reply("@mymy")
// })

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
