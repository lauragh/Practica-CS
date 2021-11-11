const { Router } = require('express');
const router = Router(); // me devuelve un objeto que voy a exportar
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const cryptico = require('cryptico');
const saltRounds = 10;
const db = admin.database();

router.get('/registro', (req, res)=> { 
    // console.log('Index works!');
    // res.send('received');
    res.render('registro');
});

router.post('/new-user', (req, res) => {

    //comprobación de que los campos del formulario
    if(req.body.name != null && req.body.pass != null && req.body.email != null && req.body.repitepass != null) {
        //acceso a la base de datos
        db.ref('/usuarios').orderByChild('email').equalTo(req.body.email).once('value', function (snapshot) {
            var encontrado = false;

            snapshot.forEach(function (childSnapshot) {
                var value = childSnapshot.val();
                // console.log("email : " + value.email);
        
                if(req.body.email == value.email){
                    encontrado = true;
                }
            });

            if(!encontrado){
                let check1 = false;
                let check2 = false;

                if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)){
                    check1 = true;
                }
                else{
                    res.render('registro', {emailErr: true}); 

                }
                if(req.body.pass == req.body.repitepass){
                    check2 = true;
                }
                else{
                    res.render('registro', {contraErr: true}); 
                }

                if(check1 && check2){
                    var publicKey = cryptico.generateRSAKey(req.body.pass, 1024);
                    var publicKeyString = cryptico.publicKeyString(publicKey);    
                    console.log(publicKey);
                    var hash = bcrypt.hashSync(req.body.pass, saltRounds);
                    var user = {
                        name: req.body.name,
                        pass: hash,
                        email: req.body.email,
                        pkey: publicKeyString
                    };
                   
                    db.ref('usuarios').push(user);
                    res.redirect('/');
                }
            }
            else
            {
                res.render('registro', {errMensaje: true}); 

            }       
        });
    }
    else{
        res.render('registro', {errMensaje2: true});
    }
 
});
module.exports = router;