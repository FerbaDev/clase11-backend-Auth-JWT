import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", {title: "Home", user: req.session.user})
})

router.get("/register", (req, res) => {
    if (req.session.login) { //si ya existe usuario lo manda al perfil
        return res.redirect("/profile")
    }
    res.render("register", {title: "Registro"})
})

router.get("/login", (req, res) => {
    if (req.session.login) { //si ya logueado lo manda a productos
        return res.redirect("/productos")
    }
    res.render("login", {title: "Login"})
})

router.get("/profile", (req, res) => {
    if (!req.session.login) { //sino está loguado lo manda al login
        return res.redirect("/login")
    }
    res.render("profile", {user: req.session.user})
})

router.get("/productos", (req, res) => {
    res.render("productos", {title: "Productos", user: req.session.user})
})


export default router;