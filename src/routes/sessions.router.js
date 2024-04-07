import express from "express";
import UserModel from "../models/user.model.js";
const router = express.Router();

//Registro

router.post("/", async (req, res) => {
    //recuperamos los datos
    const {first_name, last_name, email, age, password} = req.body;
    try {
        //Verificamos que el correo sea unico
        const userExist = await UserModel.findOne({email})
        if (userExist) {
            res.status(400).send("El correo electronico ya existe")
        } 
        const role = email === "admincoder@coder.com" ? "admin" : "user"
        //Si no esta registrado creamos nuevo usuario
        const newUser = await UserModel.create({first_name, last_name, email, age, password, role})
        //Ahora armamos la session
        req.session.login = true;
        req.session.user = {...newUser._doc}//metodo para subir el obj newUser
        //ahora tiramos un mensaje de exito
        res.status(200).send("Usuario registrado con éxito");
    } catch (error) {
        res.status(500).send("Error interno del server en session router")
    }
    res.render("register", {title: "Session"})
})

//Login

router.post("/login", async (req, res) => {
    const {email, password} = req.body; //traemos los datos del body
    try {
        const usuario = await UserModel.findOne({email});
        if (usuario) {
            if (usuario.password === password) {
                req.session.login = true;
                req.session.user = {...usuario._doc};
                res.redirect("/productos");
            } else {
                res.status(401).send("Error de autenticación");
            }
        } else {
            res.status(404).send("Usuario no encontrado, session router");
        }
    } catch (error) {
        res.status(500).send("Error del server en login session.router")
    }
})

//Logout
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
        res.redirect("/login")
    }
})



export default router;