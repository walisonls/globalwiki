const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const Posts = require('./Posts.js')


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

mongoose
  .connect(
    "mongodb+srv://root:Ez10xL59glHFmNcK@cluster0.7fzjz.mongodb.net/posts?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(function () {
    console.log("successfully connected!!!");
  })
  .catch(function (err) {
    console.log(err.message);
  });

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

app.get('/',(req,res)=>{

    if(req.query.busca == null){
        Posts.find({}).sort({'_id': -1}).exec(function(err,posts){
            //console.log(posts[0]);
            posts = posts.map(function(val){
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                miniDescricao: val.conteudo.substr(0, 100),
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            })
            res.render("home", {posts:posts});
        })
    }else{
        res.render('busca',{});
    }
})//render home
app.get('/:slug',(req,res)=>{
    // res.send(req.params.slug);
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc : {views: 1}}, {new: true}, function(err, resposta){
      console.log(resposta)
      console.log(req.params.slug);
      res.render("single", {noticia:resposta});
    })
})

const port = 8888;
app.listen(port, ()=>{
    console.log("Server Runing...");
    console.log("View project in: http://localhost:"+ port +"/");
})