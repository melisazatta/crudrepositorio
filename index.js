const express = require ('express');
const path = require ('path');
const hbs = require ('hbs');
const mysql = require ('mysql');
const { resourceLimits } = require('worker_threads');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/assets', express.static (__dirname +'/public'));

app.set('views', path.join(__dirname,'views'));
app.set('view engine','hbs');

//conexion a base de datos
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'productos'
})

conn.connect((err)=>{
    if(err) throw err;
    console.log('conexion establecida...')
});


// SELECT 
app.get('/',(req, res)=>{
    let sql ="SELECT * FROM producto";
    let query = conn.query(sql, (err, results)=>{
        if(err) throw err;
        res.render('productos',{
            results: results
        });
    });
});

//insertar

app.post('/save', (req, res)=>{
    let data = {producto_nombre: req.body.producto_nombre, producto_precio: req.body.producto_precio};
    let sql = "INSERT INTO producto SET ? ";
    let query = conn.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/');
        
    });
});

//update
app.post('/update',(req, res) => {
    let sql = "UPDATE producto SET producto_nombre='"+req.body.producto_nombre+"', producto_precio='"+req.body.producto_precio+"' WHERE producto_id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });


  //delete
  app.post('/delete',(req, res) => {
  let sql = "DELETE FROM producto WHERE producto_id="+req.body.producto_id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });


//server listening
app.listen(8000, ()=>{
    console.log('Server is running at port 8000');
});