const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

mongoose
  .connect(
    "mongodb+srv://root:Ez10xL59glHFmNcK@cluster0.7fzjz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
        res.render('home',{});
    }else{
        res.render('busca',{});
    }
})
app.get('/:slug',(req,res)=>{
    // res.send(req.params.slug);
    res.render('single',{});
})

const port = 8888;
app.listen(port, ()=>{
    console.log("Server Runing...");
    console.log("View project in: http://localhost:"+ port +"/");
})