import { Router } from "express";
// controllers
import { createTodo, getTodos } from "../controllers/todo.controller.js";

// middlewares
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// all routes

router.route("/create").post(verifyJWT, createTodo); // combination of middlewares and controllers
router.route('/get-all').get(verifyJWT, getTodos)



export default router;
