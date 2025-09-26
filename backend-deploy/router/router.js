import express from 'express'
const route = express.Router()
import { login, logout, signup ,getme} from '../controller/auth.control.js';

import protectorcookie from '../middleware/protectorcookie.js';

route.post("/signup" ,signup)
route.post("/login" ,login)
route.post("/logout" ,logout)
route.get("/me",protectorcookie,getme)

export default route;