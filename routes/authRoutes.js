const express = require("express")
const Tought = require("../models/Tought")
const Router = express.Router()
const AuthController = require("../controllers/AuthController")

Router.get("/login", AuthController.login)
Router.get("/register", AuthController.register)

module.exports = Router;