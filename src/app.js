import express from "express";
const app = express();
const PUERTO = 8080;
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import 'dotenv/config'
import exphbs from "express-handlebars";
import "./mongoConfig.js"
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//middleware para cookie parser
const PASSWORD = "clavesecreta";
app.use(cookieParser(PASSWORD));
//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Middleware Express Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware de session
app.use(session({
    secret: "secretCoder",
    resave: true,  
    saveUninitialized: true,  

    //MONGO STORE
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://Ferbadev:${process.env.PASSWORD}@cluster0.qaz6nck.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`, ttl: 120
    })
    
}))
//cambios con passport
initializePassport();
app.use(passport.initialize())
app.use(passport.session()) 

//rutas
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
//listen
app.listen(PUERTO, () => {
    console.log(`Conectado a http://localhost:${PUERTO}`);
})