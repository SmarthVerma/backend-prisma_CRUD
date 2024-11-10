import { asyncHandler2 } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { dbConnect } from "../dbConnect/index.js";

export const verifyJWT = asyncHandler2(async (req, _, next) => {
    try {
        const prisma = await dbConnect()
        console.log(`cookies`, req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) throw new ApiError(401, "Unauthorized request")
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECERT)
        console.log('this is decoded token', decodedToken)
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.id, // Find user by id
            },
        });


        req.user = user

        next()
    } catch (error) {
        console.log('Error while generatin token')
        throw new ApiError(401, error?.message || 'Invalid access token')
    }
})