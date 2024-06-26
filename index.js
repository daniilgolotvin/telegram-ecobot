require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

const sessions = new Map();
const keyboardOptions = {
  remove_keyboard: true,
};



function getRandomReply() { 
  const replies = [
    'Keep calm and сдавай мусор!',
    'Мусор есть, но вы держитесь!',
    'Батарейку не сдал, косарь отдал !',
    'Хватит играть в бутылочку, сдай ее!',
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

const randomReply = getRandomReply();

const selectCityKeyboard = new Keyboard()
      .text('Выкса')
      .text('Муром')
      .text('Навашино').row()
			.text('< Назад в меню', 'back-to-main-menu')
      .placeholder('Выбрать город')
      .resized();

const VyksaKeyboard = new InlineKeyboard()
  .text('Пластик', 'button-plastic-vyksa')
  .text('Батарейки', 'button-battery-vyksa')
  .text('Стекло', 'button-glass-vyksa').row()
	.text('< Вернуться к выбору города!', 'backSitySelect')
	


const NavaShinoKeyboard = new InlineKeyboard()
  .text('Пластик', 'button-plastic-nava-shino')
  .text('Батарейки', 'button-battery-nava-shino')
  .text('Стекло', 'button-glass-nava-shino');

const MyromKeyboard = new InlineKeyboard()
  .text('Пластик', 'button-plastic-myrom')
  .text('Батарейки', 'button-battery-myrom')
  .text('Стекло', 'button-glass-myrom');

const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back');

const mainMenuKeyboard = new Keyboard()
  .text('Выбрать город')
  .text('Часто задаваемые вопросы')
  .text('Настройки')
  .text('Поддержать проект')
  .resized();

const faqKeyboard = new InlineKeyboard()
  .text('Что можно сдавать?', 'faq-what-to-recycle').row()
  .text('Где найти пункты сбора?', 'faq-locations').row()
  .text('Как подготовить мусор?', 'faq-preparation');

const settingsKeyboard = new InlineKeyboard()
  .text('Язык', 'settings-language')
  .text('Уведомления', 'settings-notifications')
  .text('Назад в меню', 'back-to-main-menu');

// Команды
bot.api.setMyCommands([{ command: 'start', description: 'Start bot' }]);

bot.command('start', async (ctx) => {
  const helloMessage = await ctx.reply(`🔥 Эй, ${ctx.from.first_name}! 🔥
Я тот самый Эко бот, который не даст тебе шанса на безответственность. 🌍♻️
Так что хватит бездельничать, выбери, наконец, нужную опцию и займись делом. 🗑️🛠️
Сколько можно откладывать на потом? Время действовать! ⏰⚡
Соберём мусор и сделаем мир чище, или так и будем сидеть на диване? 🛋️➡️🌟`,
    {
      reply_markup: mainMenuKeyboard,
      parse_mode: "HTML"
    });

  setTimeout(async () => {
    await ctx.api.deleteMessage(ctx.chat.id, helloMessage.message_id);
  }, 60000);
});


bot.hears('< Назад в меню', async (ctx) => {
	await ctx.reply('Главное меню', {
			reply_markup: mainMenuKeyboard,
	});
});


bot.on('message:text', async (ctx) => {
  const text = ctx.message.text;

  if (text === 'Выбрать город') {
    
    await ctx.reply('Выберите город:', {
      reply_markup: selectCityKeyboard,
      parse_mode: "HTML"
    });

  } else if (['Выкса'].includes(text)) {
    const VyksaMessage = await ctx.reply('Вы выбрали город Выкса...', {
      reply_markup: { remove_keyboard: true },
    });
		await ctx.react('🦄');
    await ctx.reply(randomReply, {
      reply_markup: VyksaKeyboard,
    });
    setTimeout(async () => {
      await ctx.api.deleteMessage(ctx.chat.id, VyksaMessage.message_id);
    }, 1500);

  } else if (['Навашино'].includes(text)) {
    const NavaShinoMessage = await ctx.reply('Вы выбрали город Навашино...', {
      reply_markup: { remove_keyboard: true },
    });
    await ctx.reply("Мусор есть, но вы держитесь:с", {
      reply_markup: NavaShinoKeyboard,
			parse_mode: "HTML"
    });
    setTimeout(async () => {
      await ctx.api.deleteMessage(ctx.chat.id, NavaShinoMessage.message_id);
    }, 1500);
  } else if (['Муром'].includes(text)) {
    const MyromMessage = await ctx.reply('Вы выбрали город Муром...', {
      reply_markup: { remove_keyboard: true },
    });
    await ctx.reply(randomReply, {
      reply_markup: MyromKeyboard,
    });
    setTimeout(async () => {
      await ctx.api.deleteMessage(ctx.chat.id, MyromMessage.message_id);
    }, 1500);
  } else if (text === 'Часто задаваемые вопросы') {
    await ctx.reply('Выберите вопрос:', {
      reply_markup: faqKeyboard,
    });
  } else if (text === 'Настройки') {
    await ctx.reply('Выберите настройку:', {
      reply_markup: settingsKeyboard,
    });
  } else if (text === 'Поддержать проект') {
    await ctx.reply('Спасибо за вашу поддержку! Вы можете сделать пожертвование, нажав на кнопку ниже.', {
      reply_markup: new InlineKeyboard().text('Сделать пожертвование', 'donate')
    });
  }
});


// Если нажали кнопку Пластик в Выксе
bot.callbackQuery('button-plastic-vyksa', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Решили сдавать пластик?',
    reply_markup: keyboardOptions,

  });
  const plasticMessage = await ctx.callbackQuery.message.editText(`🤔 Решили избавиться от пластика? Отлично!
🏆 Превосходный выбор, воин экологии! 🥇

👉 Пластик неси сюда — прямо в центр! 💪

📝 Вот что нужно сделать:
1️⃣ 📦 Подготовьте пластик:
   - Тщательно промойте и высушите.
   - Убедитесь, что на нём нет остатков пищи или напитков.
   - Снимите этикетки, если это возможно.

2️⃣ 📞 Позвоните нам, если возникли вопросы:
   - ☎️ Номер телефона: +7 (xxx) xxx-xx-xx

3️⃣ 📍 Найдите нас здесь:
   - 🏢 ул Пушкина, д. Колотушкина

🗺️ Давайте делать мир чище вместе! 🌍`,{
		parse_mode: "HTML"
	});
  const locationMessage = await ctx.replyWithLocation(55.321282, 42.174339,  {
    reply_markup: backKeyboard,
  });
  sessions.set(ctx.chat.id, { locationMessageId: locationMessage.message_id, plasticMessageId: plasticMessage.message_id });
});

bot.callbackQuery('button-glass-vyksa', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Решили сдавать Стекло?',
  });
  const plasticMessage = await ctx.callbackQuery.message.editText(`🔥 Решили сдавать стекло? 🔥

А ты, кажется, серьёзно поднимаешь экологическую планку! Стекло - это ваш шанс немного почистить этот мир от лишнего хлама. Давай устроим здесь приличный "стеклянный бум"! 💪

1️⃣ 💡 Подготовка стекла к сдаче:

		-Очисти бутылки и банки от всего лишнего.
		-Открути крышки - они нам не нужны.

2️⃣📞 Цифры знаешь?
		- ☎️ Номер телефона: +7 (xxx) xxx-xx-xx

3️⃣📍 Райончик такой-то?
		- 🏢 ул Пушкина, д. Колотушкина

Неси стекло сюда, к нам. Уверены, ты сделаешь это стильно и с пользой для нашей планеты!

`, {
		parse_mode: "HTML"
	});
  const locationMessage = await ctx.replyWithLocation(42.174339, 55.321282, {
    reply_markup: backKeyboard,
  });
  sessions.set(ctx.chat.id, { locationMessageId: locationMessage.message_id, plasticMessageId: plasticMessage.message_id });
});


bot.callbackQuery('button-battery-vyksa', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Решили сдавать батарейки?',
  });
  const plasticMessage = await ctx.callbackQuery.message.editText(`🔥 Готов утилизировать батарейки? Отличный выбор, боец за чистоту окружающей среды! 💥

👉 Батарейки — важный элемент, не забывай сдавать их сюда, куда прямо поднимается наша экологическая армия! 💪

📝 Как это сделать:
1️⃣ 📦 Подготовь батарейки:

Убедись, что они вынуты из устройств и не испорчены.
Не пытайся разбирать батарейки на детали.
Используй специальные контейнеры для безопасного сбора.
2️⃣ 📞 Есть вопросы? Не стесняйся звонить:

☎️ Телефон: +7 (123) 456-78-90
3️⃣ 📍 Наш адрес:

🏢 Москва, ул. Зеленая, д. 123
🗺️ Вместе мы делаем мир чище и ярче! 🌍🌟
`, {
		parse_mode: "HTML"
	});
  const locationMessage = await ctx.replyWithLocation(55.753700, 37.621250, {
    reply_markup: backKeyboard,
  });
  sessions.set(ctx.chat.id, { locationMessageId: locationMessage.message_id, plasticMessageId: plasticMessage.message_id });
});

// Обработчик для кнопки возврата
bot.callbackQuery('back', async (ctx) => {
  await ctx.answerCallbackQuery();
  const session = sessions.get(ctx.chat.id);
  if (session && session.locationMessageId && session.plasticMessageId) {
    await ctx.api.deleteMessage(ctx.chat.id, session.locationMessageId);
    await ctx.api.deleteMessage(ctx.chat.id, session.plasticMessageId);
  }
  await ctx.reply(randomReply, {
    reply_markup: VyksaKeyboard,
  });
});

bot.callbackQuery('backSitySelect', async (ctx) => {
	await ctx.answerCallbackQuery({
		reply_markup: { remove_keyboard: true },
	});
  await ctx.answerCallbackQuery({
		text: 'Выберите город',
	});  
	await ctx.reply('Выберите город:', {
		reply_markup: selectCityKeyboard,
	});
});

const backFAQKeyboard = new InlineKeyboard().text('< Назад в меню', 'backFAQ');

bot.callbackQuery('backFAQ', async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.callbackQuery.message.editText('Часто задаваемые вопросы', {
		reply_markup: faqKeyboard,}); 
	});

bot.callbackQuery('faq-what-to-recycle', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Что можно сдавать?',
		reply_markup: { remove_keyboard: true }
  });

  await ctx.callbackQuery.message.editText(`🟡 <b>Пластик</b>:
- ПЭТ-пластик (ПЭТЕ): Бутылки от воды, соков, безалкогольных напитков. Обычно маркировано символом "1" на дне.

- Полиэтилен высокой плотности (ПЭВП, ПВД): Пакеты, пленка, контейнеры для молочных продуктов. Маркировка "2".

- Полипропилен (ПП): Бутылки для медицинских препаратов, контейнеры для масла, меда, маркировка "5".

Полиэтилен терефталат (ПЭТГ): Упаковочные материалы, контейнеры для косметики и бытовой химии, маркировка "7".

🟢 <b>Стекло</b>:

- Без маркировки: Стеклянные бутылки, банки, стекла из окон. Очистите от прочих материалов и остатков напитков.

🔋 <b>Батарейки</b>:

- Литий-ионные (Li-Ion): Мобильные телефоны, ноутбуки, аккумуляторы от электроинструментов. Сдавайте в специализированные пункты.

- Никель-кадмиевые (Ni-Cd): Старые аккумуляторы, батарейки от портативных устройств. Сдавайте для безопасной утилизации.

- Повербанки: Их можно сдать как старые аккумуляторы. Проверьте, есть ли возможность замены аккумулятора, и если нет, утилизируйте.

<b>Это лишь часть того, что можно сдавать. Главное, помните о заботе о нашей планете и выбирайте правильные способы утилизации материалов!</b>`, {
		parse_mode: "HTML",
		reply_markup: backFAQKeyboard,
	});
});

bot.callbackQuery('faq-locations', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Где найти пункты сбора?',
		reply_markup: { remove_keyboard: true }
  });
  await ctx.callbackQuery.message.editText('Пункты сбора расположены в различных частях города. Пожалуйста, выберите город для подробностей.',{
		parse_mode: "HTML",
		reply_markup: backFAQKeyboard,
	});
});

bot.callbackQuery('faq-preparation', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Как подготовить мусор?',
		reply_markup: { remove_keyboard: true }
  });
  await ctx.callbackQuery.message.editText(`📦 Пластик:

Помойте пластик, как будто завтра от этого зависит мир. Никаких остатков еды или питья, только чистота!
Снимите этикетки и не забудьте высушить. Наша природа заслуживает лучшего, чем пластик с остатками.
🍶 Стекло:

Давайте будем здесь по-мужски: удаляйте все лишнее с бутылок и банок. Очистите их от всего, что не является стеклом!
Крышки? Да лучше без них! Они нам не нужны в этой игре чистоты.
🔋 Батарейки:

Батарейки должны быть целыми и чистыми, как глаза орла. Без проливов, без повреждений!
Это профессиональный подход к мусору, ведь мы заботимся о нашей планете с максимальной отдачей и смелостью!`,{
		parse_mode: "HTML",
		reply_markup: backFAQKeyboard,
	}
		
	);
});

bot.callbackQuery('settings-language', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Выберите язык',
  });
  await ctx.callbackQuery.message.editText('Язык интерфейса пока доступен только на русском.');
});

bot.callbackQuery('settings-notifications', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: 'Настройки уведомлений',
  });
  await ctx.callbackQuery.message.editText('Уведомления пока недоступны.');
});





// Обработка донатов
bot.callbackQuery('donate', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.replyWithInvoice({
    title: 'Поддержка проекта',
    description: 'Сделайте пожертвование для поддержки нашего проекта.',
    payload: 'donate-payload',
    provider_token: process.env.PAYMENT_PROVIDER_TOKEN, // Токен платежного провайдера
    currency: 'RUB',
    prices: [{ label: 'Пожертвование', amount: 10000 }], // Сумма в копейках (10000 копеек = 100 рублей)
    start_parameter: 'donate',
    photo_url: 'https://example.com/donation-image.jpg', // URL изображения для донатов (необязательно)
  });
});

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
