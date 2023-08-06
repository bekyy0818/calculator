const TelegramBot = require("node-telegram-bot-api");
const token = "6019650681:AAEuLbejTSDGCNLXirHlQcj7yZesuHqh5tM";
const bot = new TelegramBot(token, { polling: true });

const operation = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "(", callback_data: "(" },
        { text: ")", callback_data: ")" },
        { text: "C", callback_data: "c" },
        { text: "←", callback_data: "←" },
      ],
      [
        { text: "7", callback_data: "7" },
        { text: "8", callback_data: "8" },
        { text: "9", callback_data: "9" },
        { text: "÷", callback_data: "/" },
      ],
      [
        { text: "4", callback_data: "4" },
        { text: "5", callback_data: "5" },
        { text: "6", callback_data: "6" },
        { text: "x", callback_data: "*" },
      ],
      [
        { text: "1", callback_data: "1" },
        { text: "2", callback_data: "2" },
        { text: "3", callback_data: "3" },
        { text: "+", callback_data: "+" },
      ],
      [
        { text: ".", callback_data: "." },
        { text: "0", callback_data: "0" },
        { text: "=", callback_data: "=" },
        { text: "-", callback_data: "-" },
      ],
    ],
  }),
};

const admin = async (chatId) => {
  const adminPanel = `Assalomu alekum, bu odiy calcualtor bot bo'lib sizning matematik misollaringizni ishlab berishi mumkun. Agar sizda bu bot haqida taklif va shikoyatingiz bo'lsa, pastdagi Admin tugmasini ustiga bosib bog'lanishingiz mukun.`;
  await bot.sendMessage(chatId, adminPanel, {
    reply_markup: {
      inline_keyboard: [[{ text: "Admin", url: "https://t.me/uzb_alex" }]],
    },
  });
};

function misolJavobi(misol) {
  try {
    return eval(misol);
  } catch (error) {
    return "Xato";
  }
}
let currentExpression = "";

const start = () => {
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text; // Orqali kiritilgan so'zning so'ngidagi bo'sh joylarni olib tashlaymiz

    if (messageText === "/start") {
      bot.sendMessage(
        chatId,
        "Salom bot hush kelibsiz, misollaringizni ishlash uchun /calculator ustiga bosing yoki bo'lmasam /misol deb boshlab o'zingizni savolingingizni bersangiz bo'ladi miol uchun /misol 8+2 yani shunga o'xshgan"
      );
    }

    if (messageText === "/info") {
      return admin(chatId);
    }

    if (messageText === "/calculator") {
      bot.sendMessage(
        chatId,
        "Bot dan foydalgan holda misollaringizni ishlashingiz mumkun.\n Misol:",
        operation
      );
    }

    if (messageText.startsWith("/misol ")) {
      const misol = messageText.substring(7).trim();
      const javob = misolJavobi(misol);

      bot.sendMessage(chatId, `Javob: ${javob}`);
    }
    // Define a variable to keep track of the current calculation expression
    
  });

  bot.on("callback_query", (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data; // The data field contains the value of the clicked button

    // Check which button was clicked and perform the corresponding action
    switch (data) {
      case "c":
        // Clear the calculation or reset the state
        currentExpression = ""; // Reset the expression
        bot.editMessageText(
          "Bot dan foydalgan holda misollaringizni ishlashingiz mumkun.\n Misol:",
          {
            chat_id: chatId,
            message_id: msg.message.message_id,
            reply_markup: operation.reply_markup,
          }
        );
        break;
      case "←":
        // Handle backspace functionality
        // Update the message to show the new state after backspace
        currentExpression = currentExpression.slice(0, -1); // Remove the last character
        bot.editMessageText(
          "Bot dan foydalgan holda misollaringizni ishlashingiz mumkun.\n Misol: " +
            currentExpression,
          {
            chat_id: chatId,
            message_id: msg.message.message_id,
            reply_markup: operation.reply_markup,
          }
        );
        break;
      case "=":
        // Perform the calculation and show the result
        // You need to implement this logic based on the current state of the calculation
        // bot.editMessageText(...);
        // Perform the calculation and show the result
        try {
          const result = eval(currentExpression); // Evaluate the expression
          currentExpression = result.toString(); // Update currentExpression with the result

          bot.editMessageText(
            "Bot dan foydalgan holda misollaringizni ishlashingiz mumkun.\n Misol: " +
              currentExpression,
            {
              chat_id: chatId,
              message_id: msg.message.message_id,
              reply_markup: operation.reply_markup,
            }
          );
        } catch (error) {
          // Handle any errors during evaluation (e.g., division by zero, invalid expression, etc.)
          currentExpression = ""; // Reset the expression
          bot.editMessageText(
            "Bot dan foydalgan holda misollaringizni ishlashingiz mumkun.\n Misol: Error",
            {
              chat_id: chatId,
              message_id: msg.message.message_id,
              reply_markup: operation.reply_markup,
            }
          );
        }

        break;
      default:
        // Handle other buttons like digits and operators
        // Append the clicked button's value to the current expression
        currentExpression += data;
        bot.editMessageText(
          "Bot dan foydalgan holda misollaringizni ishlashingiz mumkun.\n Misol: " +
            currentExpression,
          {
            chat_id: chatId,
            message_id: msg.message.message_id,
            reply_markup: operation.reply_markup,
          }
        );
        break;
    }
  });
};
start();
