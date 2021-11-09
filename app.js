const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const apiRoutes = require('./src/routes');
const Session = require('./src/models/session');
const User = require('./src/models/user');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
var contador = 1;


require('dotenv').config();


//Puerto
const port = process.env.PORT || 3000;

//Swagger
const swaggerOptions = {
    swaggerDefinition: {
        swagger: "2.0",
        info: {
            title: "Swagger Test API",
            description: "test api for swagger documentation",
            version: "1.0.0",
            servers: ['http://localhost:' + port],
            contact: {
                name: "ISOG",
                correo: "greenvana14@gmail.com"
            }
        }
    },
    apis: ['app.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/assets', express.static(path.join(__dirname, 'public')));

//DB
const { Db } = require('mongodb');
const mongoose = require('mongoose');
const uri = "mongodb+srv://"+process.env.DB+"/Cluster0?retryWrites=true&w=majority"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db..."))
    .catch((err) => console.log(err));


app.listen(port, () => {
    console.log('App is listening in port: ' + port);
});


/** 
 * @swagger
 * /user/:email:
 *  get:
 *    description: User get by email
 *    parameters:
 *      - in: body
 *        name: password
 *        description: password of the user
 *        type: string
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.get('/user/:email', (req, res) => {
    User.findOne({ "email": req.params.email })
        .then((result) => {
            if (result.password === req.body.password) {
                res.send(result)
            } else {
                res.send("Error")
            }
        })
        .catch((err) => console.log(err));

});


/** 
 * @swagger
 * /user:
 *  post:
 *    description: create user
 *    parameters:
 *      - in: body
 *        name: email
 *        description: email of the user
 *        type: string
 *      - in: body
 *        name: password
 *        description: user password
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
 * /session:
 *  post:
 *    description: create session
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
app.post('/session', (req, res) => {
    Session.find()
    const session = new Session({
        id_session: contador,
        name: req.body.name
    });
    contador++;
    
    session.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err))
});

/** 
 * @swagger
 * /session/:id/link:
 *  get:
 *    description: generate the link
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.get('/session/:id/link', (req, res) => {
    let link = "http://127.0.0.1:3000/session/" + req.params.id
    Session.findByIdAndUpdate(req.header('id_session'), { url: link }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(link);
        }
    })
        .then((result) => {
            return result;
        })
        .catch((err) => console.log(err))

});

/** 
 * @swagger
 * /session/:id:
 *  get:
 *    description: get the session link
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.get('/session/:id', (req, res) => {
    Session.findOne({ "id_session": req.params.id })
        .then((result) => {
            res.send(result)
        })
        .catch((err) => console.log(err))
});


/** 
 * @swagger
 * /session/:id:
 *  post:
 *    description: add the messages
 *    parameters:
 *      - in: body
 *        name: message
 *        description: the content of the message
 *        type: string
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.put('/session/:id', (req, res) => {
    Session.findOne({ "id_session": req.params.id })
        .then((result) => {
            const array = result.messages;
            array.push(req.body)
            result.messages = array;
            result.url = "http://127.0.0.1:3000/session/" + req.params.id;

            Session.findOneAndUpdate({ "id_session": req.params.id }, result, { upsert: true }, function (err, doc) {
                if (err) return res.send(500, { error: err });
                return res.send('Succesfully saved.');
            });
        })
});

app.use(router);
app.use('/api', apiRoutes);