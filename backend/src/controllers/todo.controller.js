import { dbConnect } from "../dbConnect/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTodo = asyncHandler(async (req, res) => {
    const prisma = await dbConnect()
    const { title, description } = req.body;
    console.log({ title, description });

    // Create the Todo and associate it with the user
    const savedTodo = await prisma.todo.create({
        data: {
            title,
            description,
            creatorId: req.user.id, // Assuming `req.user.id` is the user who is creating the Todo
        }
    });

    if (!savedTodo) throw new ApiError(500, "Error adding todo");

    console.log(savedTodo);

    return res.status(201).json(
        new ApiResponse(200, savedTodo, "todo Successfully added")
    )
})

const getTodos = asyncHandler(async (req, res) => {
    const prisma = await dbConnect();

    // Fetch all todos for the authenticated user
    const todos = await prisma.todo.findMany({
        where: { creatorId: req.user.id } // Assuming each Todo has a `creatorId` field linking it to a user
    });

    if (!todos) throw new ApiError(404, "No todos found");

    // Return the todos in the response
    return res.status(201).json(
        new ApiResponse(200, todos, "todos successfully fetched")
    )
});


export { createTodo, getTodos }