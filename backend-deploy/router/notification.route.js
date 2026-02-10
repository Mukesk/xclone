 import express from "express";

import protectorcookie from "../middleware/protectorcookie.js";
import { deleteNotification, showNotification } from "../controller/notification.control.js";
 const notRoute = express.Router()
 notRoute.get("/",protectorcookie,showNotification)
 notRoute.delete("/",protectorcookie,deleteNotification)
 

export default notRoute 