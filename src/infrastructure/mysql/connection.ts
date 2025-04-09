import { Sequelize } from "sequelize";


export const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

sequelize.authenticate().then(async () => {
    await sequelize.sync({ force: false })
    console.log("Connection has been established successfully.")
}).catch((err) => {
    console.error("Unable to connect to the database:", err)
})