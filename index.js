const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js')
const token = '5845807260:AAF2Bt_ejoh2xoBCzRP95h0F6tLRbUQ2G_8';
const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать.', gameOptions);
}
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Получить инфу о пользователе' },
        { command: '/game', description: 'Давай сыграем' }
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, 'Добро пожаловать! Я бот.');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я не понимаю, о чем ты...');
    });

    bot.on('callback_query', (query) => {
        const chatId = query.message.chat.id || query.from.id;
        const userNumber = parseInt(query.data);
        const randomNumber = chats[chatId];

        if (query.data === '/again') {
            return startGame(chatId)
        }
        if (userNumber === randomNumber) {
            return bot.sendMessage(chatId, 'Поздравляю! Ты угадал число!', againOptions);
        } else {
            return bot.sendMessage(chatId, 'К сожалению, ты не угадал число.', againOptions);
        }
    });
};

start();