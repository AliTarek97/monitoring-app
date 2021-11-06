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
import { auth } from "./middlewares/auth";


import { startCronJob } from "./util/cronJob";
// // API keys and Passport configuration
// import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

// mongoose.connect(mongoUrl).then(
//     () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
//         console.log("Connected to MongoDB");
//     },
// ).catch(err => {
//     console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
//     // process.exit();
// });

(async ()=>{
    try {
        await mongoose.connect(mongoUrl);
        await startCronJob();
    } catch (error) {
        console.log(error.message);
    }
})();

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

app.post("/api/check", auth, checkController.createCheck);
// app.patch("/api/check/:checkId", apiController.auth, checkController.editCheck);
app.delete("/api/check/:checkId", auth, checkController.deleteCheck);

app.get("/api/check/:checkId/resume", auth, checkController.resumeCronJob);
app.get("/api/check/:checkId/pause", auth, checkController.pauseCronJob);

export default app;
