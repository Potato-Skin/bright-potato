const router = require("express").Router();
const axios = require("axios");

// axios
//   .get(
//     `https://api.openweathermap.org/data/2.5/weather?q=Lisbon&appid=${process.env.WEATHER_API_KEY}&units=metric`
//   )
//   .then((r) => {
//     console.log("r:", r.data);
//   })
//   .catch((err) => {
//     console.log("err:", err.message);
//   });
/* GET home page */
router.get("/", (req, res, next) => {
  // let user;
  // if (req.session.user) {
  //   user = req.session.user;
  // }
  // res.render("index", { user });
  axios.get("https://officeapi.dev/api/quotes/random").then((response) => {
    // axios
    // .get("https://rickandmortyapi.com/api/character")
    // .then((responseFromRick) => {
    // const images = responseFromRick.data.results.map((e) => e.image);
    res.render("index", { quote: response.data.data.content });
    // });
    console.log("response:", response.data);
    // no longer necessary to send user. its being sent in the middleware in app.js -> res.locals.user
  });
});

module.exports = router;
