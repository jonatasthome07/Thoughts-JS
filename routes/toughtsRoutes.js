const express = require("express")
const Tought = require("../models/Tought")
const Router = express.Router()
const ToughtsController = require("../controllers/ToughtsController")
const checkAuth = require("../helpers/auth").checkAuth

Router.get("/", ToughtsController.showToughts)
Router.get("/dashboard",checkAuth,ToughtsController.dashboard)
Router.get("/add",checkAuth,ToughtsController.createTought)
Router.post("/add",checkAuth,ToughtsController.createToughtSave)

module.exports = Router;