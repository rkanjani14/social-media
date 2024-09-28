const mongoose = require("mongoose")
const connectdb = async (DATABASE_URL) => {
    const DB_OPTIONS = {
        dbName:process.env.DB_NAME
    }
    await mongoose.connect(DATABASE_URL,DB_OPTIONS)
    console.log("db connected")
}
connectdb(process.env.DATABASE_URL)
module.exports = connectdb
