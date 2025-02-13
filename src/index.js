import express from 'express'
import dbConnect from './database/index.js'
import dotenv from 'dotenv'


const app = express()
const port = 3000
const host = '127.0.0.1'

app.get("/",(req,res)=>{
    res.send("Hi Job Vaccacy")
})

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