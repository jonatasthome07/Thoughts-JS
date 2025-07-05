const {Sequelize} = require("sequelize")
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT
    }
)

async function Connection() {
    try {
        await sequelize.authenticate()
        console.log("Conexão realizada!")
    } catch (error) {
        console.log(error)
    }
}

Connection()
module.exports = sequelize;