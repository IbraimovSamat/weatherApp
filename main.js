import WeatherApiService from "./core/service";

const apiKey = "febf1a6291b83f9038eb70755bebbd00";

const lat = 33.44;
const lon = -94.44;
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
const city = "Bishkek";
const weatherApiService = new WeatherApiService(
  apiKey,
  lat,
  lon,
  undefined,
  baseUrl
);
let result;

async function fetchingWeatherData(city) {
  try {
    const response = await weatherApiService.getWeatherApiService(city);
    result = response;
    return result;
  } catch (error) {
    throw new Error("fetchingWeatherData :", Error);
  }
}
//---------------------------------------------------loading page
window.addEventListener("load", async () => {
  const currentCity = document.querySelector(".city");
  const currentTemp = document.querySelector(".temperature");
  const currentWeather = document.querySelector(".weather");
  const mainIcon = document.querySelector(".main-icon");
  const date = document.querySelector(".date");
  const timeRecord = document.querySelector(".time-label__record");
  const realFeel = document.querySelector(".conditions__block-temp");
  const wind = document.querySelector(".conditions__block-wind");
  const cards = document.querySelectorAll(".carousel .card");
  const iconOfWeather = document.querySelectorAll(".carousel .card img");
  const searchInp = document.querySelector(".search__inp");
  const searchForm = document.querySelector(".search__form");

  const user = document.querySelector(".group__list-item.user img");
  const sublistMenu = document.querySelector(".group__sublist");
  user.addEventListener("click", () => {
    sublistMenu.classList.toggle("active");
  });
  let now = new Date(); // Текущее время
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = daysOfWeek[new Date().getDay()];
  const month = months[new Date().getMonth()];
  const year = new Date().getFullYear();
  const day = new Date().getDate();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();

  if (window.innerWidth <= 600) {
    document
      .querySelector(".search")
      .after(document.querySelector(".weekly-inner__wrapper"));
  }

  const setWeatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };
  // ---------------------------------------------- SEARCH
  let searchVal;
  searchInp.addEventListener("input", (e) => {
    searchVal = e.target.value;
  });

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!searchVal) return;
    try {
      result = await fetchingWeatherData(searchVal);
      updateTemp();
    } catch (error) {
      alert(`${error} : Неправильно введено`);
    }
  });

  await fetchingWeatherData(city);

  const updateTemp = () => {
    const {
      city: { name },
      list,
    } = result;
    currentCity.innerHTML = name;

    const arr = new Array();
    list.forEach((item) => {
      if (now - new Date(item.dt_txt) > 0) {
        arr.push(item);
      }
    });
    const currentData = arr.reduce((accum, currentVal) => {
      return currentVal.dt > accum.dt ? currentVal : accum;
    });

    currentTemp.innerHTML = `${Math.round(currentData.main.temp)}&deg;C`;
    realFeel.innerHTML = `${Math.round(currentData.main.feels_like)}&deg;C`;
    wind.innerHTML = `${Number(
      Math.round(currentData.wind.speed) * 3.6
    ).toString()} km/hr`;
    currentWeather.innerHTML = `${currentData.weather[0].main}`;

    cards.forEach((card) => {
      card.dataset.id === dayOfWeek.toLocaleLowerCase()
        ? card
            .querySelector("img")
            .setAttribute("src", setWeatherIcon(currentData.weather[0].icon))
        : "";
    });
    list.forEach((item) => {
      const day = new Date(item.dt_txt).getDay();
      switch (day) {
        case 0: {
          document
            .getElementById("sunday")
            .setAttribute("src", setWeatherIcon(item.weather[0].icon));
        }
        case 1: {
          document
            .getElementById("monday")
            .setAttribute("src", setWeatherIcon(item.weather[0].icon));
        }
        case 2: {
          document
            .getElementById("tuesday")
            .setAttribute("src", setWeatherIcon(item.weather[0].icon));
        }
        case 3: {
          document
            .getElementById("wednesday")
            .setAttribute("src", setWeatherIcon(item.weather[0].icon));
        }
        case 4: {
          document
            .getElementById("thursday")
            .setAttribute("src", setWeatherIcon(item.weather[0].icon));
        }
        case 5: {
          document
            .getElementById("friday")
            .setAttribute("src", setWeatherIcon(item.weather[0].icon));
        }
        case 6: {
          document
            .getElementById("saturday")
            .setAttribute("src", setWeatherIcon(item.weather[0].icon));
        }
      }
    });
    mainIcon.setAttribute("src", setWeatherIcon(currentData.weather[0].icon));

    // ----------------------------------------------- canvas

    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "16px Arial";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let tempFilteredData = result.list.filter(
      (item) => new Date().getDate() === new Date(item.dt_txt).getDate()
    );
    let tempData = tempFilteredData.map((item) => {
      return {
        time: `${Math.round(new Date(item.dt_txt).getHours())}: 00`,
        temperature: `${Math.round(item.main.temp)}`,
      };
    });

    let leftPadding = 50; // Дополнительный отступ слева
    let rightPadding = 50; // Дополнительный отступ справа
    function drawTemperatureCurve(data) {
      let maxTemp = Math.max(...data.map((point) => point.temperature)) + 5;
      let minTemp = Math.min(...data.map((point) => point.temperature)) - 5;

      let topPadding = 60;
      let bottomPadding = 60;
      let heightScale =
        (canvas.height - topPadding - bottomPadding) / (maxTemp - minTemp);

      let startX = leftPadding;
      let endX = canvas.width - rightPadding;
      let intervalWidth = (endX - startX) / (data.length - 1);

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FFC355";

      data.forEach((point, index) => {
        let x = startX + index * intervalWidth;
        let y =
          canvas.height -
          bottomPadding -
          (point.temperature - minTemp) * heightScale;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        ctx.fillStyle = "white";
        ctx.fillText(point.temperature + "°C", x, y - 10);
        ctx.fillText(point.time, x, canvas.height - bottomPadding + 20);
      });

      ctx.stroke();

      // Добавляем текущую точку времени
      // Получаем текущее время и переводим его в минуты
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      // Находим ближайшую метку в массиве tempData
      const closestPoint = tempData.reduce((prev, curr) => {
        const [hour, minute] = curr.time.split(":").map(Number);
        const totalMinutes = hour * 60 + minute;
        return Math.abs(totalMinutes - currentTotalMinutes) <
          Math.abs(prev - currentTotalMinutes)
          ? totalMinutes
          : prev;
      }, Number.MAX_VALUE);

      // Находим индекс ближайшей метки
      const closestIndex = tempData.findIndex((point) => {
        const [hour, minute] = point.time.split(":").map(Number);
        const totalMinutes = hour * 60 + minute;
        return totalMinutes === closestPoint;
      });

      // Отображаем точку
      if (closestIndex !== -1) {
        let currentX = startX + closestIndex * intervalWidth;
        let currentTemp = tempData[closestIndex].temperature;
        let currentY =
          canvas.height - bottomPadding - (currentTemp - minTemp) * heightScale;

        // Рисуем маркер для текущего времени
        ctx.fillStyle = "#fff"; // красный цвет маркера
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, 2 * Math.PI); // рисуем круговой маркер
        ctx.fill();
      }
    }

    drawTemperatureCurve(tempData);
  };

  updateTemp();

  //- - - - - - - - - -- - - - - - -- --- - - - - - - - -Date

  date.innerHTML = `${dayOfWeek} | ${day} ${month} ${year}`;
  // setInterval(() => updateTemp(), 15000);
  if (hour < 12) {
    timeRecord.innerHTML = `${hour} : ${minute} AM`;
  } else {
    timeRecord.innerHTML = timeRecord.innerHTML = `${hour % 12} : ${
      minute > 10 ? minute : "0" + minute
    } PM`;
  }
  cards.forEach((card) => {
    if (card.dataset.id === dayOfWeek.toLocaleLowerCase()) {
      card.classList.add("today");
    }
  });

  //  ----------------------------------------------- update time
  setInterval(() => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    if (hour < 12) {
      timeRecord.innerHTML = `${hour} : ${minute} AM`;
    } else {
      timeRecord.innerHTML = `${hour % 12} : ${
        minute > 10 ? minute : "0" + minute
      } PM`;
    }
  }, 1000);
});
