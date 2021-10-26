const mongoose = require('mongoose');
const Schema = mongoose.Schema

const session_squema = new Schema({
    id_session : {
        type : Number,
        required : true
    },
    nombre :{
        type : String,
        require : true
    },
    mensajes : {
        type: Array,
        require : true
    },
    admin : {
        type : String,
    },
    url : {
        type : String
    }

}, {timestamps : true});

const session = mongoose.model('session', session_squema);
module.exports = session;