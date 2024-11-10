import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    console.log('Generating AccessToken', process.env.ACCESS_TOKEN_SECERT)
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        process.env.ACCESS_TOKEN_SECERT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

export const generateRefreshToken = (user) => {
    console.log('Generating RefreshToken', process.env.REFRESH_TOKEN_SECERT)
    console.log(user)
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.REFRESH_TOKEN_SECERT,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};