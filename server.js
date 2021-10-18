/*

show webpage
api to post key-value pairs of data
api to fetch latest data

 */
import stream, {pipeline} from "stream"
import express from "express"
import cors from "cors"
import * as fs from 'fs'
import open from 'fs/promises'
import ndjson from "ndjson"
import {promisify} from 'util'
const finished = promisify(stream.finished); // (A)

async function logChunks(readable) {
    for await (const chunk of readable) {
        console.log(chunk);
    }
}

async function shutdown(writable) {
    writable.end(); // (C)
    // Wait until done. Throws if there are errors.
    await finished(writable);
    process.exit(0)
}

async function read_data(file) {

    try {
        const readable = fs.createReadStream(file, {encoding: 'utf8'});
        for await (const chunk of readable) {
            console.log("input",chunk)
        }
        return []
    } catch {
        console.log("error opening")
        return []
    }
}

function create_outstream(file) {
    return fs.createWriteStream(file, {encoding:"utf8", flags:'a'})
}

async function setup() {
    const controller = new AbortController();

    let latest_data = await read_data("data.ndjson")
    console.log("latest data is",latest_data)
    let outstream = create_outstream("data.ndjson")
    outstream.on('error',() => {
        console.log("stream had an error")
    })
    outstream.on('close',() => {
        console.log('stream closed')
    })
    outstream.on('finish',() => {
        console.log("stream finished")
    })

    process.on('SIGINT', () => {
        console.info('SIGINT signal received.');
        shutdown(outstream)
    });
    process.on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        shutdown(outstream)
    });

    let station_data = {

    }



    function append_data(msg) {
        if(!station_data[msg.station]) station_data[msg.station] = []
        msg.timestamp = new Date().toJSON()
        let data = station_data[msg.station]
        if(data.length > 10) data.splice(0,data.length-10)
        data.push(msg)
        console.log("added",msg)
        outstream.write(JSON.stringify(msg)+"\n")
        console.log("wrote out")
    }

    const app = express()
    app.use(express.json())
    app.use(cors())
    app.get('/',(req,res)=>{
        res.sendFile('index.html',{ root:'html' })
    })
    app.get('/charts.js',(req,res)=>{
        res.sendFile('charts.js',{ root:'html' })
    })

    app.get('/latest',(req,res)=> res.json(station_data))
    app.post("/post",(req,res)=>{
        try {
            console.log("received a post request", req.headers, req.body)
            if(!req.body) throw new Error("missing body")
            if(!req.body.station) throw new Error("missing station")
            append_data(req.body)
            res.json({
                status: 'success',
                message: "got your data",
                data:req.body,
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

}

setup().then(()=>console.log("running"))





