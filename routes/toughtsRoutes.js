const express = require("express")
const Tought = require("../models/Tought")
const Router = express.Router()
const ToughtsController = require("../controllers/ToughtsController")
const checkAuth = require("../helpers/auth").checkAuth

Router.get("/", ToughtsController.showToughts)
Router.get("/dashboard",checkAuth,ToughtsController.dashboard)
Router.post("/remove",checkAuth,ToughtsController.removeTought)
Router.get("/add",checkAuth,ToughtsController.createTought)
Router.post("/add",checkAuth,ToughtsController.createToughtSave)

module.exports = Router;