import app from "./app";
import config from "./config";

const port = 5000;
console.log(config.port);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
