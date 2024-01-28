const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
    name: { type: String, required: true, minLength: 2, maxLength: 100, unique: true },
});

module.exports = mongoose.model("Developer", DeveloperSchema);
