require("dotenv").config();

const epxress = require("express");
const app = epxress();
const port = process.env.PORT || 7000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
