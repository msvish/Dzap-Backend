const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

const corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/latestcoins", async (req, res) => {
  try {
    await fetch(process.env.GET_LISTS, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.API_KEY,
      },
      method: "GET",
      params: {
        sort: "market_cap",
        limit: "100",
        sort: "desc",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        let customResponse = [];
        const coinData = data.data;
        coinData.map((coin) => {
          let obj = {
            id: coin.id,
            name: coin.name,
          };
          customResponse.push(obj);
        });
        res.status(200).json({ data: customResponse });
      } else {
        res.status(400).json({ message: `Https error ${response.status}` });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/currencies", async (req, res) => {
  try {
    await fetch(process.env.GET_CURRIENCES, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.API_KEY,
      },
      method: "GET",
      params: {
        sort: "name",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        let customResponse = [];
        const coinData = data.data;
        coinData.map((coin) => {
          let obj = {
            id: coin.id,
            name: coin.name,
            sign: coin.sign,
          };
          customResponse.push(obj);
        });
        res.status(200).json({ data: customResponse });
      } else {
        res.status(400).json({ message: `Https error ${response.status}` });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/conversion", async (req, res) => {
  const request = req.body;
  try {
    await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100&convert_id=${request.currency}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.API_KEY,
        },
        method: "GET",
      }
    ).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        const coinData = data.data;
        coinData.filter((coin) => {
          if (coin.id === request.cryptocurrency) {
            res
              .status(200)
              .send(
                `Total price : ${request.sign}${
                  coin["quote"][`${request.currency}`].price * request.amount
                }`
              );
            return;
          }
        });
      } else {
        res.status(400).json({ message: `Https error ${response.status}` });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(3001, () => {
  console.log("server listening at 3001");
});
