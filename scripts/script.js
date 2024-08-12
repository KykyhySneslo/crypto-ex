// Функция для загрузки данных о топ-10 криптовалютах
function loadTopCryptos() {
  const apiKey =
    "ae601b35818f112d15ec79c499b3231922e209ee4569f0a9dcaa076d63e771a7";
  const topCryptosCount = 10;
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=${topCryptosCount}&tsym=USD&api_key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const cryptos = data.Data;
      let html = "";
      cryptos.forEach((crypto, index) => {
        html += `
            <tr>
              <th scope="row" style=" padding-top: 1px">${index + 1}</th>
              <td style="border-bottom: 3px solid #fff">${
                crypto.CoinInfo.FullName
              }</td>
              <td style="border-bottom: 3px solid #fff;">${
                crypto.CoinInfo.Name
              }</td>
              <td style="border-bottom: 3px solid #fff">$${crypto.RAW.USD.PRICE.toFixed(
                2
              )}</td>
              <td style="border-bottom: 3px solid #fff">${crypto.RAW.USD.CHANGEPCT24HOUR.toFixed(
                2
              )}%</td>
            </tr>
          `;
      });
      document.getElementById("crypto-data").innerHTML = html;
    })
    .catch((error) => console.error(error));
}

// Загрузка данных после открытия страницы
loadTopCryptos();

// Обновление данных каждые 5 минут
// setInterval(loadTopCryptos, 5 * 60 * 1000); // 5 минут = 5 * 60 * 1000 миллисекунд

// Функция для расчета суммы обмена криптовалюты
function calculateExchange(resultId, resultConvertedId) {
  const amount = parseFloat(document.getElementById("amount").value);
  const crypto = document.getElementById("crypto").value;
  const apiKey =
    "ae601b35818f112d15ec79c499b3231922e209ee4569f0a9dcaa076d63e771a7";
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${crypto}&tsyms=USD,USDT&api_key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const price = data.USD;
      const result = (amount * price - 0.01 * (amount * price)).toFixed(2);
      const resultElement = document.getElementById(resultId);
      resultElement.innerHTML = `Вы получаете: $ ${result}`;
      resultElement.style.display = "block";

      // Скрыть другой результат
      const otherResultId =
        resultId === "result" ? "resultConverted" : "result";
      const otherResultElement = document.getElementById(otherResultId);
      otherResultElement.style.display = "none";
    })
    .catch((error) => console.error(error));
}

// Функция для расчета обратной суммы
function calculateReverse(resultId, resultConvertedId) {
  const amount = parseFloat(document.getElementById("amount2").value);
  const crypto = document.getElementById("crypto2").value;
  const apiKey =
    "ae601b35818f112d15ec79c499b3231922e209ee4569f0a9dcaa076d63e771a7";
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${crypto}&tsyms=USD,USDT&api_key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const price = data.USD;
      const result = (amount / price - 0.01 * (amount / price)).toFixed(8);
      const resultElement = document.getElementById(resultId);
      resultElement.innerHTML = `Вы получаете: ${result} ${crypto}`;
      resultElement.style.display = "block";

      // Скрыть другой результат
      const otherResultId =
        resultId === "result2" ? "resultConverted2" : "result2";
      const otherResultElement = document.getElementById(otherResultId);
      otherResultElement.style.display = "none";
    })
    .catch((error) => console.error(error));
}

// Открыть модальное окно
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Закрыть модальное окно
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

("use strict");

const TELEGRAM_BOT_TOKEN = "5815075358:AAFb3tBeboxNATKwtfMuXONH7kgjoT04BsA";
const TELEGRAM_CHAT_ID = "-1001717413442";
const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

async function sendEmailTelegram(event) {
  event.preventDefault();

  const form = event.target;
  const formBtn = document.querySelector(".form-button button");
  const formSendResult = document.querySelector(".form__send-result");
  formSendResult.textContent = "";

  const { name, email, phone } = Object.fromEntries(
    new FormData(form).entries()
  );

  const text = `Заявка от ${name}\nEmail: ${email}\nТелефон: ${phone}`;

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }),
    });

    if (response.ok) {
      formSendResult.textContent =
        "Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.";
      form.reset();
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
    formSendResult.textContent = "Заявка не отправлена! Попробуйте позже.";
    formSendResult.style.color = "red";
  }
}
