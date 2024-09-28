const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const dotenv = require("dotenv")
dotenv.config()
const connectdb = require("./connectdb")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const app = express()
const PORT = process.env.PORT || '3000'

// Middlewares
app.use(express.json())
app.use(morgan("common"))

// Routes
app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/posts",postRoute)

// Server
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
