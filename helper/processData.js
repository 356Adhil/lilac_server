// Helper function: Process and structure the data
const processData = (data) => {
  return data.map((item) => ({
    name: item.name.common,
    capital: item.capital ? item.capital[0] : "N/A",
    region: item.region,
    subregion: item.subregion,
    population: item.population,
    languages: item.languages
      ? Object.values(item.languages).join(", ")
      : "N/A",
    currencies: item.currencies
      ? Object.values(item.currencies)
          .map((currency) => currency.name)
          .join(", ")
      : "N/A",
    flag: item.flags.png,
    timezones: item.timezones ? item.timezones.join(", ") : "N/A",
  }));
};

exports.processData = processData;
