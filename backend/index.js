import express from "express";
import cors from "cors";
import apiRouter from "./src/routes/API Router/apiRouter.js";
import wss from "./src/routes/Web Socket/webSocket.js"; // not delete this line
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.static("public"));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
