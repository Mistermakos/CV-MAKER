import express from 'express';

import {Main_Page_Get, Main_Page_Post} from "./Controllers/Main_Page_Controller.js"
import {Redirect_Main} from "./Controllers/Redirect_Controller.js"
import {CV_Create} from "./Controllers/CV_Create_Controller.js"

const router = express.Router();

router.get("/", await Main_Page_Get)
router.post("/", await Main_Page_Post)
router.get('/CV', await CV_Create)
router.get("*", await Redirect_Main)

export default router;