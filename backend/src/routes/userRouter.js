import { Router } from "express";
// controllers
import { registerUser, loginUser } from "../controllers/userController.js";

// middlewares
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// all routes

router.route("/register").post(registerUser); // combination of middlewares and controllers
router.route("/login").post(loginUser); // combination of middlewares and controllers




export default router;
