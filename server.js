/*

show webpage
api to post key-value pairs of data
api to fetch latest data

 */
import express from "express"


const app = express()
app.use(express.json())
app.get('/',(req,res)=>{
    res.sendFile('index.html',{ root:'html' })
})


let latest_data = {
}

let station_data = {

}

function append_data(msg) {
    if(!msg.station) throw new Error("missing station id")
    if(!station_data[msg.station]) station_data[msg.station] = []
    let ar = station_data[msg.station]
    if(ar.length > 10) ar.splice(0,ar.length-10)
    ar.push(msg)
}

app.get('/latest',(req,res)=> res.json(station_data))
app.post("/post",(req,res)=>{
    try {
        console.log("received a post request", req.headers, req.body)
        if (req.body.station) append_data(req.body)
        // Object.entries(req.body).forEach(([key, val]) => {
        //     latest_data[key] = val
        // })
        res.json({
            status: 'success',
            message: "got your data"
        })
    } catch (e) {
        try {
            res.json({status: 'failure', message: "" + e})
        } catch (e) {
            res.close()
        }
    }
})

app.listen(3000,()=>{
    console.log('we started the webserver')
})





