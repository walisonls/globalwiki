const express = require('express');

const path = require('path');

const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

app.get('/',(req,res)=>{

    if(req.query.busca == null){
        res.render('home',{});
    }else{
        res.send(req.query.busca)
    }
})
app.get('/:slug',(req,res)=>{
    res.send(req.params.slug);
})

app.listen(5050, ()=>{console.log('Server Runing...')})