const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
let responseData;
let DB_NAME = "moviesdb";
let COLLECTION_NAME = "ssr"
const uri = `mongodb+srv://sravanithoomuganti:Sravani1997@cluster0.el4zimc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        
        const client = new MongoClient(uri);
    try {
        await client.connect();
        responseData = await getAllDataFromMongo(client)
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(responseData[0]))
    } finally {
        await client.close();
    }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

async function getAllDataFromMongo(client) {
    const cursor = client.db(DB_NAME).collection(COLLECTION_NAME)
        .find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log('results===========>', results)
        return results;
    } else {
        console.log(`No results==========.`);
    }
}

const PORT = process.env.PORT || 3838;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));