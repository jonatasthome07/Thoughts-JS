//Importações
require("dotenv").config()
const express = require("express")
const exphbs = require("express-handlebars")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const flash = require("express-flash")
const app = express()
const conn = require("./db/conn")
const User = require("./models/User")
const Tought = require("./models/Tought")
const toughtsRoutes = require("./routes/toughtsRoutes")
const ToughtsController = require("./controllers/ToughtsController")
const AuthController = require("./controllers/AuthController")
const authRoutes = require("./routes/authRoutes")
const checkAuth = require("./helpers/auth").checkAuth

//Configurações
app.set("view engine", "handlebars")
app.engine("handlebars", exphbs.engine())

//Middlewares
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    name:"session",
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    
    store: new FileStore({
        logFn: function(){},
        path: require ("path").join(require("os").tmpdir(), "sessions")
    }),
    cookie:{
        secure:false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}))

app.use(flash())
app.use("/toughts", toughtsRoutes)
app.use("/", authRoutes)
app.use((req,res,next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

app.get("/",checkAuth,ToughtsController.showToughts)

//Aplicação
conn.sync()
.then(()=>{
    app.listen(process.env.PORT)
})
.catch((err)=>{
    console.log(err)
})
