import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI} from "./util/secrets";

// Controllers (route handlers)
import * as apiController from "./controllers/api";
import * as checkController from "./controllers/checkController";

// // API keys and Passport configuration
// import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

/**
 * Primary app routes.
 */
app.post("/api/user/signup", apiController.signUp);
app.post("/api/user/login", apiController.login);
app.get("/api/user/verify/:id/:code",apiController.verifyUser);

app.post("/api/check/create", apiController.auth, checkController.createCheck);

export default app;
