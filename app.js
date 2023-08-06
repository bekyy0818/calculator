Matematik amallarni tashlaydigan funksiya
    function evaluateExpression(expression) {
      return new Function('return ' + expression)();
    }
  
    Agar amalni tashlasa, javobni topib foydalanuvchiga yuboramiz
    if (/^\d+(\s*[\+\-\*\/]\s*\d+)+$/.test(text)) {
      try {
    const result = evaluateExpression(text);
    bot.sendMessage(chatId, `Javob: ${result}`); 
      } catch (error) {
        bot.sendMessage(chatId, `Xatolik yuz berdi, iltimos, to'g'ri formatda savol yuboring.`);
      }
    }