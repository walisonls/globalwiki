const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

var session = require("express-session");

const Posts = require('./Posts.js')


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use(session({secret: "keyboard cat", cookie: { maxAge: 60000 }}));


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

      Posts.find({titulo: {$regex: req.query.busca,$options:"i"}},function(err,posts){
        console.log(posts)
        res.render("busca", {posts:posts, contagem:posts.length});
      })
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

var usuarios = [
    {
        login: "guilherme",
        password: "123456",
    },
];

app.post('/admin/login',(req, res)=>{
  usuarios.map(function(val){
    if(val.login == req.body.login && val.password == req.body.password){
      req.session.login = "guilherme";
    }
  })

  res.redirect('/admin/login');

})

app.post('/admin/cadastro',(req, res)=>{
  //proxima aula, inserir no banco de dados
  res.send('cadastrado com sucesso')
})

app.get('/admin/login',(req, res)=>{
  if(req.session.login == null){
    res.render('admin-login')
  }else{
    res.render('admin-panel');
  }
})

app.get('/admin/deletar/:id',(req, res)=>{
  res.send("deletado a noticia com id" + req.params.id)
})


const port = 8888;
app.listen(port, ()=>{
    console.log("Server Runing...");
    console.log("View project in: http://localhost:"+ port +"/");
})