const mongoose = require('mongoose');
const Schema = mongoose.Schema

const session_squema = new Schema({
    id_session : {
        type : Number,
        required : true
    },
    messages : {
        type: Array,
        require : true
    }
}, {timestamps : true});

const Session = mongoose.model('Session', session_squema);
module.exports = Session;