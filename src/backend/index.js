//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');

var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    utils.query("SELECT * FROM Devices",function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});
app.get('/devices/:id', function(req, res, next) {
    utils.query("SELECT * FROM Devices where id = "+req.params.id, function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});


app.get('/devices_update/:id/:state', function(req, res, next) {
    const id = req.params.id.split("_")[1];
    const state = req.params.state;
    //utils.query("SELECT * FROM Devices where id = "+req.params.id, function(error,respuesta,campos){
        utils.query("UPDATE Devices SET state = "+ state + " WHERE id = " + id, function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});

app.get('/devices_check_name/:name', function(req, res) {
    const name = req.params.name;

    const query = "SELECT COUNT(*) AS count FROM Devices WHERE name = ?";
    const values = [name];

    utils.query(query, values, function(error, results, fields) {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: "Fallo la consulta" });
        }

        const count = results[0].count;

        if (count === 0) {
            res.status(200).json({ disponible: true });
        } else {
            res.status(200).json({ disponible: false });
        }
    });
});

app.get('/devices_delete/:name', function(req, res) {
    const name = req.params.name;

    const query = "DELETE FROM Devices WHERE name = ?";
    const values = [name];

    utils.query(query, values, function(error, result) {
        if (error) {
            console.error("Error al eliminar dispositivo:", error);
            return res.sendStatus(409); 
        }

        res.sendStatus(200); 
    });
});

app.get('/devices_create/:name/:description/:type/', function(req, res) {
    const { name, description, type } = req.params;
    const tipo = parseInt(type);

    if (isNaN(tipo) || (tipo !== 0 && tipo !== 1)) {
        return res.status(400).send({ error: "Tipo inválido" });
    }

    const query = "INSERT INTO Devices (name, description, state, type) VALUES (?, ?, 0, ?)";
    const values = [name, description, tipo];

    utils.query(query, values, function(error, resultado, campos) {
        if (error == null) {
            console.log(resultado);
            res.status(200).send(resultado);
        } else {
            console.error(error);
            res.status(409).send({ error: "Fallo en la creación" });
        }
    });
});

app.get('/algo',function(req,res,next){

    console.log("llego una peticion a algo")
    res.status(409).send({nombre:"Matias",apellido:"Ramos",dni:2131});
});
app.get('/algoInfo/:nombre',function(req,res,next){
    
    
    res.status(200).send({saludo:"Hola "+req.params.nombre});
});

app.post('/algoInfoBody/',function(req,res,next){
    console.log(req.body);
    if(req.body.nombre != undefined){
        res.status(200).send({saludo:"Hola "+req.body.nombre});
    }else{
        res.status(409).send({error:"Falta el nombre"});
    }
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
