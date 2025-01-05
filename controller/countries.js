const axios = require("axios");
const { processData } = require("../helper/processData");

// API: countries
// Description: Get all countries
// Method: GET

exports.getCountries = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(48, parseInt(req.query.limit) || 12));

    const { data } = await axios.get(process.env.API_URL);
    const processedData = processData(data);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = processedData.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedData,
      currentPage: page,
      totalPages: Math.ceil(processedData.length / limit),
      totalItems: processedData.length,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({
      message: error.response?.data?.message || "Internal server error",
    });
  }
};

// API: countries/code
// Description: Get country by code
// Method: GET
// Params: code

exports.getCountryByCode = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: "Country code is required" });
  }
  try {
    const { data } = await axios.get(process.env.API_URL);
    const country = data.find(
      (item) => item.cca2.toLowerCase() === code.toLowerCase()
    );
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    const processedData = processData([country])[0]; // Process single country
    res.status(200).json(processedData);
  } catch (error) {
    res.status(500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};

// API: countries/region
// Description: Get countries by region
// Method: GET
// Params: region

exports.getCountriesByRegion = async (req, res) => {
  const { region } = req.query;
  if (!region) {
    return res.status(400).json({ message: "Region is required" });
  }
  try {
    const { data } = await axios.get(process.env.API_URL);
    const countries = data.filter(
      (item) => item.region.toLowerCase() === region.toLowerCase()
    );
    if (!countries.length) {
      return res.status(404).json({ message: "Countries not found" });
    }
    const processedData = processData(countries);
    res.status(200).json(processedData);
  } catch (error) {
    res.status(500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};

// API: countries/search
// Description: Search for countries
// Method: GET
// Params: name, capital, region, timezone

exports.searchCountry = async (req, res) => {
  const {
    name = "",
    capital = "",
    region = "",
    timezone = "",
    page = 1,
    limit = 12,
  } = req.query;

  const validatedPage = Math.max(1, parseInt(page));
  const validatedLimit = Math.max(1, Math.min(48, parseInt(limit)));

  if (!name && !capital && !region && !timezone) {
    return res
      .status(400)
      .json({ message: "At least one search parameter is required" });
  }

  try {
    const { data } = await axios.get(process.env.API_URL);

    const filteredCountries = data.filter((item) => {
      const commonName = item.name?.common?.toLowerCase() || "";
      const capitalName = item.capital?.[0]?.toLowerCase() || "";
      const regionName = item.region?.toLowerCase() || "";
      const timezoneName = item.timezones?.[0]?.toLowerCase() || "";

      return (
        (!name || commonName.includes(name.toLowerCase())) &&
        (!capital || capitalName.includes(capital.toLowerCase())) &&
        (!region || regionName.includes(region.toLowerCase())) &&
        (!timezone || timezoneName.includes(timezone.toLowerCase()))
      );
    });

    const startIndex = (validatedPage - 1) * validatedLimit;
    const endIndex = startIndex + validatedLimit;
    const paginatedCountries = filteredCountries.slice(startIndex, endIndex);
    const processedData = processData(paginatedCountries);

    res.status(200).json({
      data: processedData,
      currentPage: validatedPage,
      totalPages: Math.ceil(filteredCountries.length / validatedLimit),
      totalItems: filteredCountries.length,
      itemsPerPage: validatedLimit,
    });
  } catch (error) {
    console.error("Error searching countries:", error);
    res.status(500).json({
      message: error.response?.data?.message || "Internal server error",
    });
  }
};
