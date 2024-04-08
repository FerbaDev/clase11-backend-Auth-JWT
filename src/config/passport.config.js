import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
//traemos el modelo y las funciones de bcrypt
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import GitHubStrategy from "passport-github2"

const initializePassport = () => {
    //estrategia de registro 
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",

    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;
        try {
            //verificamos si el mail existe
            let user = await UserModel.findOne({email});
            if (user) return done(null, false)
            
            let newUser= { 
                first_name, last_name, email, age, password: createHash(password)
            }
            let result = await UserModel.create(newUser);
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))
    
    passport.use("login", new LocalStrategy({ usernameField: "email"}, async (email, password, done) => {
        try {
            let user = await UserModel.findOne({email});
            if (!user) {
                console.log("Usuario no existe");
                return done(null, false)
            }
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    //serializar usuarios
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id: id});
        done(null, user);
    })

    passport.use("github", new GitHubStrategy({
        clientID:"Iv1.86f2f1d311f39467",
        clientSecret: "ec4afdff62a0a36f0242f234496ca0977eee052d",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        // chequear que todo funciona bien, mostar por consola el perfil: 
        //console.log("Perfil del usuario:", profile);
        try {
            let user = await UserModel.findOne({email:profile._json.email});

            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "Usuario",
                    age: 36,
                    email: profile._json.email,
                    password: "contrasenia",
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            
        }
    }))
}

export default initializePassport; 