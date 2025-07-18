const express = require("express")
const Tought = require("../models/Tought")
const Router = express.Router()
const AuthController = require("../controllers/AuthController")

Router.get("/login", AuthController.login)
Router.post("/login", AuthController.loginPost)
Router.get("/register", AuthController.register)
Router.post("/register", AuthController.registerPost)
Router.get("/logout", AuthController.logout)

module.exports = Router;