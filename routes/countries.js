const router = require("express").Router();
const {
  getCountries,
  getCountryByCode,
  getCountriesByRegion,
  searchCountry,
} = require("../controller/countries");

router.get("/", getCountries);
router.get("/code", getCountryByCode);
router.get("/region", getCountriesByRegion);
router.get("/search", searchCountry);

module.exports = router;
