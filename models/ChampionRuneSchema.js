const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ChampionRuneSchema = new Schema({
    champion: {
        required: true,
        type: String
    },
    runes:{
        required: true,
        type: [Object]
    },
    statPerks:{
        required: true,
        type: Object
    }
})

let ChampionRuneModel = mongoose.model("Runes", ChampionRuneSchema);

module.exports = {ChampionRuneModel}