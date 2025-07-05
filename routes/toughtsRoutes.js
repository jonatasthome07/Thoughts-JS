const express = require("express")
const Tought = require("../models/Tought")
const Router = express.Router()
const ToughtsController = require("../controllers/ToughtsController")

Router.get("/", ToughtsController.showToughts)

module.exports = Router;