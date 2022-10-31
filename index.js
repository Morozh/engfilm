require('dotenv').config();

const { Telegraf } = require('telegraf');
const commands = require('./js/const');
const axios = require('axios');
const filmLink = 'https://lookmovie2.to/movies/view/';

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  const username = ctx.message.from.first_name ? ctx.message.from.first_name : 'англичанин';

  ctx.reply(`Привет ${username}!\n\nНапиши мне название фильма, который ты хотел(а) бы посмотреть:`);
});
bot.help((ctx) => ctx.reply(commands.commands));

bot.on('text', async (ctx) => {
  const message = await ctx.message.text;

  axios.get(`http://www.omdbapi.com/?t=${message}&apikey=${process.env.OMDB_KEY}`)
    .then((movie) => {
      const titleToLink = `${movie.data.Title.toLowerCase().split(' ').join('-')}-${movie.data.Year}`;

      ctx.replyWithPhoto(
        {
          url: movie.data.Poster ? movie.data.Poster : ''
        },
        {
          caption: `Film: ${movie.data.Title} - ${movie.data.Year}\n\n★ Internet Movie Database - ${movie.data.imdbRating}\n\n${movie.data.Plot}\n\nWatch now: ${filmLink}${titleToLink}`
        }
      )
    })
    .catch((error) => {
      ctx.reply('Название фильма не найдено в базе данных, попробуйте ввести другой фильм.');
      console.error(`Error: ${error}`);
    });
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
