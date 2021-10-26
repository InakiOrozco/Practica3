const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const router = express.Router();
const Database = require('./src/models/database');
const apiRoutes = require('./src/routes');

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:admin@cluster0.cfrb0.mongodb.net/Cluster0?retryWrites=true&w=majority";

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
} 

//Puerto
const port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const swaggerOptions = {
    swaggerDefinition:{
        swagger: "2.0",
        info: {
            title:"Swagger Test API",
            description: "test api for swagger documentation",
            version: "1.0.0",
            servers: ['http://localhost:'+port],
            contact: {
                name: "ISOG",
                email: "greenvana14@gmail.com"
            }
        }
    },
    apis: ['app.js']
}

app.use('/assets', express.static(path.join(__dirname, 'public')));

MongoClient.connect(uri, {
    useUnifiedTopology: true
}, function (err, client) {
    if (err) {
        console.log('Failed to connect to MongoDB');
    } else {
        console.log('Se conecto a la base de datos');

        database = client.db();

        Database.setDatabase(database);

        app.listen(port, () => {
            console.log(`App is listening in port ${port}`);
        });
    }
});

/*
const { Db } = require('mongodb');
const mongoose = require('mongoose');
const uri = "mongodb+srv://Halv:vyHykVpyy08pkAO6@cluster0.kcql9.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db..."))
    .catch((err) => console.log(err));*/

/** 
 * @swagger
 * /users/:email:
 *  get:
 *    description: return the user specified
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/users/:email', (req,res) => {
    User.findOne({"email" : req.params.email})
    .then((result) => {
        
        if(result.password === req.body.password){
            res.send("Loggin.....")
            console.log(result.password)
            console.log(req.body.password)
        }else{
            res.send("failed to login")
            console.log(result.password)
            console.log(req.body.password)
        }
    })
    .catch((err) => console.log(err));
    
});


/** 
 * @swagger
 * /users:
 *  post:
 *    description: add an user
 *    parameters:
 *      - in: body
 *        name: username
 *        description: email of the user
 *        type: string
 *      - in: body
 *        name: password
 *        description: users password
 *        type: string
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.post('/user', (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save()
        .then((result => {
            res.send(result);
        })
        )
        .catch((err) => console.log(err))
    
})


/** 
 * @swagger
 * /session/:id:
 *  get:
 *    description: return the user specified
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/session/:id', (req,res) => {
    Session.findOne({"id_session" : req.params.id})
    .then((result) => {
        res.send(result)
    })
    .catch((err) => console.log(err))
});


/** 
 * @swagger
 * /session:
 *  post:
 *    description: add a new session
 *    parameters:
 *      - in: body
 *        name: name
 *        description: session name
 *        type: string  
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/session', (req, res) => {
    session.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => console.log(err))
});


/** 
 * @swagger
 * /session/:id:
 *  post:
 *    description: update a session
 *    parameters:
 *      - in: body
 *        name: message
 *        description: the content of the message
 *        type: string
 *      - in: body
 *        name: date
 *        description: message date
 *        type: string
 *      - in: body
 *        name: email
 *        description: user email
 *        type: string
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.put('/session/:id', (req,res) => {
    session.findOne({"id_session" : req.params.id})
    .then((result) => {
        const array = result.mensajes;
        array.push(req.body)
        result.mensajes = array;
        result.url = "http://127.0.0.1:3000/session/"+req.params.id;
        
        session.findOneAndUpdate({"id_session" : req.params.id}, result, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved.');
        });
    })
});

/** 
 * @swagger
 * /session/:id/link:
 *  get:
 *    description: get the link of a session
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/session/:id/link', (req,res) => {
    let link = "http://127.0.0.1:3000/session/" + req.params.id
    session.findByIdAndUpdate(req.header('id_session'), {url : link}, (err, result) =>{
        if(err){
            res.send(err);
        }else{
            res.send(link);
        }
    })
    .then((result) => {
        return result;
    })
    .catch((err) => console.log(err))
    
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

let database;


router.get('/', (req, res) => {
    const url = path.join(__dirname, 'public', 'index.html');
    res.sendFile(url);
});

app.use(router);
app.use('/api', apiRoutes);