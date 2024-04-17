import express from "express";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
const router = express.Router();
import passport from "passport";
import generateToken from "../utils/jsonwebtoken.js";

// //Registro

// router.post("/", async (req, res) => {
//     //recuperamos los datos
//     const {first_name, last_name, email, age, password} = req.body;
//     try {
//         //Verificamos que el correo sea unico
//         const userExist = await UserModel.findOne({email})
//         if (userExist) {
//             res.status(400).send("El correo electronico ya existe")
//         } 
//         //const role = email === "admincoder@coder.com" ? "admin" : "user"
//         //Si no esta registrado creamos nuevo usuario
//         const newUser = await UserModel.create({first_name, last_name, email, age, password: createHash(password)})
//         //Ahora armamos la session
//         req.session.login = true;
//         req.session.user = {...newUser._doc}//metodo para subir el obj newUser
//         //ahora tiramos un mensaje de exito
//         res.redirect("/profile");
//     } catch (error) {
//         res.status(500).send("Error en sesssssion router")
//     }
//     res.render("register", {title: "Session"})
// })

// //Login

// router.post("/login", async (req, res) => {
//     const {email, password} = req.body; //traemos los datos del body
//     try {
//         const usuario = await UserModel.findOne({email});
//         if (usuario) {
//             if (isValidPassword(password, usuario)) {
//                 req.session.login = true;
//                 req.session.user = {...usuario._doc};
//                 res.redirect("/productos");
//             } else {
//                 res.status(401).send("Error de autenticación");
//             }
//         } else {
//             res.status(404).send("Usuario no encontrado, session router");
//         }
//     } catch (error) {
//         res.status(500).send("Error del server en login session.router")
//     }
// })
// //Version para passport
// router.post("/", passport.authenticate("register", {
//     failureRedirect: "/api/sessions/failedregister"}), async (req, res) => {
//         req.session.user = {
//             first_name: req.user.first_name,
//             last_name: req.user.last_name,
//             age: req.user.age,
//             email: req.user.email
//         };
//         req.session.login = true;
//         res.redirect("/profile");
//     })

// router.get("/failedregister", (req, res) => {
//     res.send("Registro fallido");
// })

// //Login. 

// router.post("/login", passport.authenticate("login", { failureRedirect:"/api/sessions/faillogin"}), async (req, res) => {
//     if(!req.user) return res.status(400).send("Credenciales invalidas");
    
//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         email: req.user.email
//     };

//     req.session.login = true; 

//     res.redirect("/profile");

// })

// router.get("/faillogin", async (req, res) => {
//     res.send("Fallo login");
// })

// //Logout
// router.get("/logout", (req, res) => {
//     if (req.session.login) {
//         req.session.destroy();
//         res.redirect("/login")
//     }
// })

// //acceso con github
// router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})
// //github callback
// router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
//     req.session.user = req.user;
//     req.session.login = true;
//     res.redirect("/profile");
// })

//Version con JWT

// Registro


router.post("/", async (req, res) => {
    const {first_name, last_name, email, age, password} = req.body;

    try {
        //Verificamos que el correo sea unico
        const userExist = await UserModel.findOne({email})
        if (userExist) {
            res.status(400).send("El correo electronico ya existe")
        }
        const newUser = await UserModel.create({first_name, last_name, email, age, password: createHash(password)})

        //generamos el token
        const token = generateToken({id: newUser.id})
        res.status(200).send({status: "success", message: "Usuario creado con exito con JWT", token})
    } catch (error) {
        res.status(500).send("Error interno del servidor")
    }
})

//Login
router.post("/login", async (req, res) => {
    const {email, password} = req.body; //traemos los datos del body
    try {
        const usuario = await UserModel.findOne({email});
        if (!usuario) {
            return res.status(400).send("Usuario no encontrado")
        } 
        if (!isValidPassword(password, usuario)){
            res.status(401).send("Credenciales invalidas")
        }
        //Si la contraseña es correcta, generamos el token. 
        const token = generateToken({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            id: usuario._id
        })

        res.status(200).send({status:"success", message: "Login exitoso!!",token});
    } catch (error) {
        res.status(500).send("Error del server en login session.router")
    }
})


export default router;