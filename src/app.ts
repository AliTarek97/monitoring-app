import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI} from "./util/secrets";

// Controllers (route handlers)
import * as authController from "./controllers/authController";
import * as checkController from "./controllers/checkController";
import * as reportController from "./controllers/reportController";
import { auth } from "./middlewares/auth";


import { startCronJob } from "./util/cronJob";

const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

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
app.post("/api/user/signup", authController.signUp);
app.post("/api/user/login", authController.login);
app.get("/api/user/verify/:id/:code",authController.verifyUser);

app.post("/api/check", auth, checkController.createCheck);
// app.patch("/api/check/:checkId", authController.auth, checkController.editCheck);
app.delete("/api/check/:checkId", auth, checkController.deleteCheck);

app.get("/api/check/:checkId/resume", auth, checkController.resumeCronJob);
app.get("/api/check/:checkId/pause", auth, checkController.pauseCronJob);

app.get("/api/report/:checkId", auth, reportController.createReport);

export default app;
