import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { dbConnect } from '../dbConnect/index.js';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { generateAccessToken, generateRefreshToken } from "../helpers/generateTokens.js";

// Register User Controller


const generateAccessTokenAndRefreshTokens = async (userId) => {
    const prisma = await dbConnect();
    console.log('inFunction')
    try {
        // Find user by ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        console.log({ refreshToken, accessToken })
        // Update user with new refresh token
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error', error)
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};


const registerUser = asyncHandler(async (req, res) => {

    const prisma = await dbConnect();
    const { name, email, password, gender, isStudent } = req.body;


    // Check for required fields
    if (!name || !email || !password || gender === undefined || isStudent === undefined) {
        return res.status(400).json({ message: "Name, email, password, gender, and isStudent are required." });
    }
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(400).json({ message: "Email is already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password and additional fields
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            gender,
            isStudent,
        },
    });

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(newUser.id)

    res.status(201).cookie("accessToken", accessToken, {
        httpOnly: true,    // Helps prevent XSS attacks
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
        sameSite: "Strict" // Only send cookies in a first-party context
    }).json({
        message: "Successfully registered",
        data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            gender: newUser.gender,
            isStudent: newUser.isStudent,
        }
    });

});

const loginUser = asyncHandler(async (req, res) => {
    const prisma = await dbConnect();
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user.id);

    // Set tokens as cookies and send the response
    res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        })
        .json({
            message: "Successfully logged in",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                isStudent: user.isStudent,
            }
        });
});


export {
    registerUser,
    loginUser
}