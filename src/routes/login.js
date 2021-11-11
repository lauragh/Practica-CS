const { Router } = require('express');
const router = Router(); // me devuelve un objeto que voy a exportar
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

const modalTools = require('../public/modal');
const db = admin.database();

router.get('/login', (req, res)=> { 
    // console.log('Index works!');
    // res.send('received');
    res.render('login');
});

router.post('/login', (req, res) => {

    //comprobación de que los campos del formulario
    if(req.body.email != null && req.body.pass != null) {
        var encontrado = false;
        //console.log(req.body.recordarme)
        //acceso a la base de datos
        db.ref('/usuarios').orderByChild('email').equalTo(req.body.email).once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                
                var value = childSnapshot.val();
                
                if(req.body.email == value.email){
                    if(bcrypt.compareSync(req.body.pass, value.pass)){
                        encontrado = true;
                        // sacamos el id del usuario para luego hacer push en la base de datos.
                        req.session.idUsu = childSnapshot.key; 
                        req.session.pass = req.body.pass;
                        /*
                        if(req.body.recordarme == "on")
                        {
                            // Aqui usaríamos cookies
                            console.log("EL USUARIO QUIERE RECORDAR SU INICIO DE SESION");
                            console.log("Actual remember"+userSessionController.getValue());
                            userSessionController.setValue(true);
                            console.log("Actual remember"+userSessionController.getValue());
                        } 
                        */
                    }
                }

            });

            if(encontrado)  //si ha ido todo bien
            {
                req.session.logueado = true;
                res.redirect('/');
            }
            else // si no
            {
                // Mandar mensaje modal
                res.render('login', { showModal: true }); 
            }
        });
    }
    else{
        res.redirect('/');
    }
 
});
module.exports = router;