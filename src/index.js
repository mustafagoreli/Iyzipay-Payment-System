import "express-async-errors";
import dotenv from "dotenv";
import config from "./config.js";
import express from "express";
import logger from "morgan";
import https from "https";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import DBModels from "./db";
import Users from "./db/users";
import GenericErrorHandler from "./middlewares/GenericErrorHandler.js";
import ApiError from "./error/ApiError.js";
import Session from "./middlewares/Session.js";
import routes from "./routes/index";

const envPath = config?.production ?
    "./env/.prod"
    : "./env/.dev";

dotenv.config({
    path: envPath
})

// BEGIN MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDb");
}).catch((err) => {
    console.log(err);
});

// END MONGODB CONNECTION

const app = express();
const router = express.Router();

//hata


app.use(logger(process.env.LOGGER));

app.use(helmet());
app.use(cors({
    origin: "*"
}));

app.use(express.json({
    limit: "1mb"
}));
app.use(express.urlencoded({
    extended: true
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    done(null, id);
});

app.use(passport.initialize());

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOpts,
    async (jwtPayload, done) => {
        try {
            const user = await Users.findOne({ _id: jwtPayload._id });
            if (user) {
                done(null, user.toJSON());
            }
            else {
                done(new ApiError("Authorization is not valid", 401, authorizationInValid));
            }
        } catch (err) {
            return done(err, false);
        }
    }));

/*
app.use("/", (req, res) => {
    throw new ApiError("Bir hata oluştu", 404, "somethingwrong");
    res.json({
        test: 1
    })
})
*/

//burdaydı
routes.forEach((routeFn, index) => {
    routeFn(router);
});

app.use("/api", router);


app.all("/test-auth", Session, (err, res) => {
    res.json({
        test: true
    })
})

app.use(GenericErrorHandler);


if (process.env.HTTPS_ENABLED === "true") {
    const key = fs.readFileSync(path.join(__dirname, "./certs/key.pem")).toString();
    const cert = fs.readFileSync(path.join(__dirname, "./certs/cert.pem")).toString();

    const server = https.createServer({ key: key, cert: cert }, app);
    server.listen(process.env.PORT, () => {
        console.log("Express Uygulaması " + process.env.PORT + " üzerinden çalışmaktadır.")
    });


} else {
    app.listen(process.env.PORT, () => {
        console.log("Express Uygulaması " + process.env.PORT + " üzerinden çalışmaktadır.")
    });
}