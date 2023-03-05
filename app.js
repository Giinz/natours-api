const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

app.use(
    cors({
        credentials: true,
        origin: true,
    })
);
app.use((req, res, next) => {
    res.header("Content-Type", "application/json;charset=UTF-8");
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(helmet());
app.use(express.json());

// Data sanitizaion against NoSQL query injextion
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(
    hpp({
        whitelist: ["duration", "ratingsQuantity", "ratingAverage", "maxGroupSize", "difficulty", "price"],
    })
);

app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});
app.use(globalErrorHandler);
module.exports = app;
