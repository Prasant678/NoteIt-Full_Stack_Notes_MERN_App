import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import DbConnection from './db.js';
import userRouter from './Route/userRoute.js';
import noteRouter from './Route/noteRoute.js';

const app = express();
const port = process.env.PORT || 5000;

DbConnection();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/notes", noteRouter);

app.get("/", (req, res) => {
    res.send("Api is Working Successfully!");
})

app.listen(port, () => {
    console.log(`Server Running on Port http://localhost:${port}`);
})