const express = require('express')
const cors = require('cors')
const mongo = require('mongodb')
const bodyParser = require('body-parser')
const { json } = require('body-parser')

const app = express()
const port = "3030"
const client = "http://localhost:3000"
const dburl = "mongodb://127.0.0.1:27017/"

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function timelog(req, res, next) {
    console.log('\n==========================================================')
    console.log(`Time: ${Date.now()}`)
    next()
})

/*app.get('/', (req,res) => {
    console.log('Redirecting to client...')
    res.redirect(`${client}/`)
})*/

app.post('/add_student', async function (req,res) {
    console.log(req.body)
    mongo.connect(dburl,{useUnifiedTopology:true},(err, db) => {
        if (err) throw err;
        const conn = db.db('server')
        conn.collection("students").insertOne(req.body,(err,response) => {
            if (err) throw err;
            res.json({action: "success"})
        })
    })
    
})

app.get('/get_record_count', async function (req,res) {
    mongo.connect(dburl,{useUnifiedTopology:true},(err, db) => {
        if (err) throw err;
        const conn = db.db('server')
        conn.collection("students").countDocuments({}, (err, count) => {
            res.json({count: count})
        })
    })
    
})

app.get('/get_all_students', function (req,res) {
    mongo.connect(dburl,{useUnifiedTopology:true},(err, db) => {
        if (err) throw err;
        const conn = db.db('server')
        conn.collection("students").find({}).toArray().then((docs) => {
            console.log(docs)
            res.json({result: docs})
        })
    })
    
})

app.post('/delete_student', function (req,res) {
    mongo.connect(dburl,{useUnifiedTopology:true},(err, db) => {
        if (err) throw err;
        const conn = db.db('server')
        conn.collection("students").deleteOne({_id: mongo.ObjectID(req.body.id)}, (err, result) => {
            if (err) throw err;
            res.json({result: 'success'})
        })
    })
})

app.post('/fetch_by_id', function (req,res) {
    mongo.connect(dburl,{useUnifiedTopology:true},(err, db) => {
        if (err) throw err;
        const conn = db.db('server')
        conn.collection("students").findOne({_id: mongo.ObjectID(req.body.id)}, (err, result) => {
            if (err) throw err;
            res.json({result: result})
        })
    })
})

app.post('/update_student', function (req,res) {
    mongo.connect(dburl,{useUnifiedTopology:true},(err, db) => {
        if (err) throw err;
        const conn = db.db('server')
        let newValues = {
            $set: {
                name: req.body.name,
                admNum: req.body.rollnumber,
                age: req.body.age,
                phone: req.body.phone,
                city: req.body.city
            }
        }
        conn.collection("students").updateOne({_id: mongo.ObjectID(req.body.id)}, newValues, (err, result) => {
            if (err) throw err;
            res.json({result: "success"})
        })
    })
})

app.use(express.static('./build'))

app.listen(port, () => {
    console.log("Server online @ PORT:3030...")
})
