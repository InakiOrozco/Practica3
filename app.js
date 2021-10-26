const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const router = express.Router();
const Database = require('./src/models/database');
const apiRoutes = require('./src/routes');
//const login = require('./src/components/Login');

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:admin@cluster0.cfrb0.mongodb.net/Cluster0?retryWrites=true&w=majority";

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
} 

//Puerto
const port = process.env.PORT || 3000;

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

/** 
 * @swagger
 * /:
 *  get:
 *    description: api landing endpoint
 *    responses:
 *      200: 
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/', (req, res) =>{
    res.send('api works!');
});


/** 
 * @swagger
 * /users:
 *  get:
 *    description: return all users on the database
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/users', (req, res) =>{
    res.send('users endpoint!')
});


/** 
 * @swagger
 * /users/:id:
 *  get:
 *    description: return the user specified
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/users/:id', (req, res) =>{});


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

app.post('/users', (req, res) =>{
    res.send('create user endpoint');
});


/** 
 * @swagger
 * /users/:id:
 *  post:
 *    description: update an existing user
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

app.put('/users/:id', (req, res) =>{
    res.send('update user endpoint!');
});


/** 
 * @swagger
 * /sessions:
 *  get:
 *    description: return all sessions on the database
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/sessions', (req, res) =>{
    res.send('get sessions');
});


/** 
 * @swagger
 * /sessions/:id:
 *  get:
 *    description: return the user specified
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.get('/sessions/:id', (req, res) =>{});


/** 
 * @swagger
 * /sessions:
 *  post:
 *    description: add a new session
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.post('/sessions', (req, res) =>{
    res.send('create sessions endpoint');
});


/** 
 * @swagger
 * /sessions/:id:
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
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/

app.put('/sessions/:id', (req, res) =>{
    res.send('update user endpoint!');
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

let database;

app.use('/assets', express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
    const url = path.join(__dirname, 'public', 'index.html');
    res.sendFile(url);
});

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