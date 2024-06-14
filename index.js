require('dotenv').config();
const {Bot, GrammyError, HttpError} = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
	{
		command: 'start', description: 'Запуск бота'
	},
	{
	 	command: 'fsdfsfd ', description: 'Получить приветствие'
	},
]);

bot.command('sdfsd', async (ctx) => {
	await ctx.reply('Hello!');
});

bot.command('Hello', async (ctx) => {
	await ctx.reply('Hi!');
});

// bot.on('message', async (ctx) =>  {
// 	await ctx.reply('Hi!');
// });

bot.catch((err) => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}:`);
	const e = err.error;
	if (e instanceof GrammyError) {
		console.error('Error in request:', e.desc);
	} else if (e instanceof HttpError) {
		console.error('Could not contact Telegram:', e);
	} else {
		console.error('Unknown error:', e);
	}
}); 



bot.start();
