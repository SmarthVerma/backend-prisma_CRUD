import { dbConnect } from "./dbConnect/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path: './env'
});

dbConnect()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log('Error connecting to the DB:', err);
        process.exit(1);
    });