/*

show webpage
api to post key-value pairs of data
api to fetch latest data

 */
import express from "express"


const app = express()
app.use(express.json())
app.get('/',(req,res)=>{
    res.sendFile('index.html',{
        root:'html'
    })
})

let latest_data = {

}

app.get('/latest',(req,res)=> res.json(latest_data))
app.post("/post",(req,res)=>{
    console.log("received a post request",req.headers,req.body)
    Object.entries(req.body).forEach(([key,val])=>{
        latest_data[key] = val
    })
    res.json({
        status:'success',
        message:"got your data"
    })
})

app.listen(3000,()=>{
    console.log('we started the webserver')
})





