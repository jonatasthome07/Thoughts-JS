const User = require("../models/User")
const bcrypt = require("bcryptjs")

module.exports = class AuthController{
    static login (req,res){
        res.render("auth/login")
    }

    static async loginPost(req,res){
        const {email, password} = req.body
        const user =  await User.findOne({where:{email:email}})

        if(!user){
            req.flash("msg", "Usuário não encontrado. Tente novamente!")
            res.render("auth/login")
            return
        }
        
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if (!passwordMatch){
            req.flash("msg", "Senha incorreta. Tente novamente!")
            res.render("auth/login")
            return
        }
        
        try {
           req.session.userid = user.id
           req.flash("msg", "Login efetuado com sucesso!")
           req.session.save(()=>{
                res.redirect("/")
           })
        } 
        catch (error) {
            console.log(error)
        }

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