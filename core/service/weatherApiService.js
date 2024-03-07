class WeatherApiService {
  constructor(apiKey, lat, lon, part = "hourly,daily", baseUrl) {
    (this.apiKey = apiKey),
      (this.lat = lat),
      (this.lon = lon),
      (this.part = part),
      (this.baseUrl = baseUrl);
  }

  async getWeatherApiService(city) {
    const url = `${this.baseUrl}?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&q=${city}&units=metric`;
    try {
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw new Error(error);
    }
  }
}

export default WeatherApiService;
