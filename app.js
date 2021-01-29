import express from "express";

import path from "path";

import logger from "morgan";

import usersRouter from "./app/routes/users.js";

const app = express();

app.use(logger("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(path.resolve(), "public")));

app.use("/users", usersRouter);

export default app;
