import express from 'express'
import dbConnect from './database/index.js'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'


const app = express()
const port = 3000
const host = '127.0.0.1'

app.use(express.json())
app.use(express.urlencoded())

//routes

app.use("/auth",userRoutes)


dotenv.config()
dbConnect()
.then((res)=>{
    app.listen(port,()=>{
        console.log(`started on :http://${host}:${port}`)
    })
})
.catch((err)=>{
    console.log("error",err)
})