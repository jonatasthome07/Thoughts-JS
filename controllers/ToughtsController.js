const f = require("session-file-store")
const Tought = require ("../models/Tought")
const User = require("../models/User")
const {Op, ConnectionTimedOutError, or} = require("sequelize")

module.exports = class ToughtsController{
    static async showToughts(req,res){
    let search = ''
    if(req.query.search){
        search = req.query.search
    }

    let order = "DESC"

    if(req.query.order === "old"){
        order = "ASC"
    }
    else{
        order = "DESC"
    }

    const toughtsData = await Tought.findAll({include: User, where:{title: {[Op.like]: `%${search}%`}}, order:[["createdAt", order]]})
    // percorre cada item do array e retorna um novo array onde cada item é um objeto JS puro
    const toughts = toughtsData.map((result)=> result.get({plain:true}))
    let toughtsQty = toughts.length

    if(toughtsQty === 0){
        toughtsQty = false
    }

    res.render("toughts/home", {toughts, search, toughtsQty})
    }

    static async dashboard(req,res){
        const userId = req.session.userid
        const user = await User.findOne({where:{id:userId}, include: Tought})
        if(!user){
            res.redirect("/login")
        }

        const toughts = user.Toughts.map((result)=> result.dataValues)

        let emptyToughts = false
        if (toughts.length === 0){
            emptyToughts = true
        }

        res.render("toughts/dashboard", {toughts, emptyToughts})
    }

    static async createTought(req,res){
        res.render("toughts/create")
    }

    static async createToughtSave(req,res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }
        
        try {
            await Tought.create(tought)
            req.flash("msg", "Pensamento criado com sucesso!")
            req.session.save(()=>{
            res.redirect("/toughts/dashboard")
        })
        } 
        catch (error) {
            console.log(error)
        }
    }

    static async removeTought(req,res){
        const id = req.body.id
        const UserId = req.session.userid 
        try {
            await Tought.destroy({where:{id:id, UserId: UserId}})
            req.flash("msg", "Pensamento excluído com sucesso!")
            req.session.save(()=>{
                res.redirect("/toughts/dashboard")
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async updateTought(req,res){
        const id = req.params.id
        const tought = await Tought.findOne({raw:true ,where:{id:id}})
        res.render("toughts/edit", {tought})
    }

    static async updateToughtSave(req,res){
        const id = req.body.id
        const tought = {
            title: req.body.title,
        }

       try {
         await Tought.update(tought, {where:{id:id}})
         req.flash("msg", "Pensamento atualizado com sucesso!")
            req.session.save(()=>{
                res.redirect("/toughts/dashboard")
            })
       } catch (error) {
        console.log(error)
       }
    }

}