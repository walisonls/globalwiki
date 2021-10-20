var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    titulo:String,
    image:String,
    categoria:String,
    conteudo:String,
    slug:String,
},{collation:'posts'})

var Posts = mongoose.model("Posts",postSchema);

module.exports = Posts;