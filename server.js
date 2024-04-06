
import express from 'express';
import 'dotenv/config'
import router from "./Backend/Routes.js"
import bodyParser from 'body-parser';
const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/",router);
app.use("/",express.static("./Frontend"))

app.listen(process.env.PORT, () =>
  console.log('Example app listening on port 3000!'),
);

// https://www.npmjs.com/package/pdf-creator-node