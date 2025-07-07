const User = require("../models/User")
const bcrypt = require("bcryptjs")

module.exports = class AuthController{
    static login (req,res){
        res.render("auth/login")
    }
    
    static register(req,res){
        res.render("auth/register")
    }
    
    static async registerPost(req,res){
        const {name,email,password,confirmpassword} = req.body
        if (password != confirmpassword){
            req.flash("msg", "As senhas estão incorretas. Tente novamente!")
            res.render("auth/register")
            return
        }
        const checkIfUserExists = await User.findOne({where:{email:email}})
        if(checkIfUserExists){
            req.flash("msg", "E-mail já cadastrado. Tente novamente!")
            res.render("auth/register")
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const user = {name, email, password: hashedPassword}
        try {
           const userCreated = await User.create(user)
           req.session.userid = userCreated.id
           req.flash("msg", "Cadastro efetuado com sucesso!")
           req.session.save(()=>{
                res.redirect("/")
           })
        } 
        catch (error) {
            console.log(error)
        }
    }

    static logout (req,res){
        req.session.destroy()
        res.redirect("/login")
    }
}