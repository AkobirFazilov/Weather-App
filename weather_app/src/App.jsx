import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState(null); // Состояние для хранения данных
  const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
  const [error, setError] = useState(null); // Состояние для ошибок
  const [city, setCity] = useState("Kyiv");
  const [cityName, setCityName] = useState(""); // Состояние для поля ввода

  function handleWeatherOfCity() {
    setCity(cityName);
    setCityName("");
  }

  const fetchData = async () => {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=6HXHQQ65NAM8V3PN6KCTFSV2K&contentType=json`
    );
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result); // Устанавливаем данные
        setLoading(false); // Завершаем загрузку
      } catch (err) {
        setError(err); // Если ошибка, устанавливаем ее в состояние
        setLoading(false);
      }
    };

    getData(); // Вызов асинхронной функции
  }, [city, cityName]); // Пустой массив зависимостей означает, что useEffect сработает только один раз при монтировании компонента

  function handleRefresh() {
    setCityName(city);
    setCityName("");
  }
  // Рендерим разные состояния
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="weather">
      <div className="weatherOfCity">
        <input
          placeholder="Enter City"
          className="cityName"
          type="text"
          value={cityName} // связываем значение с состоянием
          onChange={(e) => setCityName(e.target.value)} // обновляем состояние по мере ввода
        />
        {cityName === "" ? (
          <button disabled className="changeCityBtn" style={{ color: "grey" }}>
            Change City
          </button>
        ) : (
          <button className="changeCityBtn" onClick={handleWeatherOfCity}>
            Change City
          </button>
        )}
        {cityName !== "" ? (
          <button disabled className="refreshBtn" style={{ color: "grey" }}>
            Refresh
          </button>
        ) : (
          <button className="refreshBtn" onClick={handleRefresh}>
            Refresh
          </button>
        )}
      </div>
      <div className="weatherData">
        {[data.days[0], data.days[1], data.days[2]].map((el, i) => {
          return (
            <div key={i} className="weather_card">
              <div className="location">Location: {data.address}</div>
              <pre>{el.datetime}</pre>
              <pre>Temparature: {Math.floor(el.temp)} *C</pre>
              <pre>Wind Speed: {el.windspeed} km/h</pre>
              <pre>Сhance of rain: {el.precip}</pre>
              <p>Description of a day: {el.description}</p>
              <pre>Сloudcover: {el.cloudcover}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
