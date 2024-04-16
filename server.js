
import express from 'express';
import 'dotenv/config'
import router from "./Backend/Routes.js"
import bodyParser from 'body-parser';
const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",express.static("./Frontend"))
app.use(express.json());
app.use("/",router);

app.listen(3000, () =>
  console.log(`Example app listening on port http://localhost:3000/`),
);

// https://www.npmjs.com/package/pdf-creator-node