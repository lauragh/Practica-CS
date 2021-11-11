const { Router } = require('express');
const router = Router(); // me devuelve un objeto que voy a exportar
const admin = require('firebase-admin');
var serviceAccount = require("../../node-firebase-8d30f-firebase-adminsdk-awb9f-7eca4cdf67.json");
const CryptoJS = require('crypto-js');
const cryptico = require('cryptico');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://node-firebase-8d30f.firebaseio.com/'
});

const db = admin.database();

const Bits = 1024; 


function randomid(length) 
{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.get('/', (req, res)=> {   // crear ruta get que me detecta dos parametros, request y response.

    if(req.session.logueado) // si el usuario se ha logueado
    {
        db.ref('usuarios/'+ req.session.idUsu +'/objetos').once('value', (snapshot) => {
            var data = snapshot.val();
            res.render('index', { objects: data });
            console.log("está actualizandose");
        });
    }
    else // si el usuario no se ha logeado se hace redirect a login
    {
        res.redirect('/login');
    }
});


// Subir encriptando
router.post('/new-encrypted-file', (req, res) => {

    if(req.files != null) // Se comprueba que el archivo existe.
    {
        var password = randomid(32);
        // Encripto la contraseña.
        var publicKey = cryptico.generateRSAKey(req.session.pass, Bits);
        var publicKeyString = cryptico.publicKeyString(publicKey);       
        var encryptPassword = cryptico.encrypt(password, publicKeyString);


        var e_data; // Variable para almacenar el archivo encriptado

        // Comprobamos si es de tipo texto o de tipo archivo.
        if(req.files.archivo.mimetype != 'text/plain') 
        {
            // Si es de tipo archivo lo convertimos a objeto JSON.
            e_data = CryptoJS.AES.encrypt(JSON.stringify(req.files.archivo.data), password).toString();
        }
        else
        {
            // Si solo es fichero de texto convertimos el contenido a string y lo almacenamos
            e_data = CryptoJS.AES.encrypt(req.files.archivo.data.toString(), password).toString();
        }
        
        // Objeto que se subirá a la base de datos.
        var cipherObject = {
            datos: e_data,
            nombre: req.files.archivo.name,
            clave: encryptPassword.cipher,
            tipo: req.files.archivo.mimetype
        };

        db.ref('usuarios/'+ req.session.idUsu +'/objetos' ).push(cipherObject); // Subo el objeto a la base de datos.
        res.redirect('/');
    }
    else // Si no recibe archivo, lo redirije al index.
    {
        res.redirect('/');
    }
});

// Metodo para descargarse el archivo desencriptado
router.get('/download-decrypted-object/:id', (req, res) => {
    db.ref('usuarios/'+ req.session.idUsu +'/objetos/' + req.params.id).once('value', (snapshot) => { // sacar los valores de la consulta de la coleccion 'objetos'.
        var values = snapshot.val();  // estos son los valores que hay en la coleccion.
        
        // desencriptar la contraseña
        var publicKey = cryptico.generateRSAKey(req.session.pass, Bits);
        var decryptedPass = cryptico.decrypt(values.clave, publicKey);

        // Compruebo si es un archivo o un texto.
        if(values.tipo != "text/plain") // Si es de tipo archivo
        {
            var bytes  = CryptoJS.AES.decrypt(values.datos, decryptedPass.plaintext); // primero desencripto los datos 
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); // los convirto a JSON para poderlos trabajar.

            var file = Buffer.from(decryptedData, 'base64'); // Si es un archivo multimedia lo codifico a base64 para que se pueda leer.
            res.writeHead(200, { // escribo la cabecera de la peticion para que se convierta en un archivo descargable.
              'Content-Disposition':"attachment; filename=" + values.nombre,  
              'Content-Type': values.tipo,
              'Content-Length': file.length
            });
            res.end(file); // mando el archivo multimedia.
        }
        else // si es de tipo text/plain (.txt)
        {
            var bytes  = CryptoJS.AES.decrypt(values.datos, decryptedPass);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            //Cabecera para mandar el archivo descargable.
            res.set({"Content-Disposition":"attachment; filename=" + values.nombre});
            res.send(originalText);
        }
    });
});

// Descargar archivo sin desencriptar
// Los pasos son los mismos que para descargalo pero sin desencriptarlo.
router.get('/download-encrypted-object/:id', (req, res) => {
    db.ref('usuarios/'+ req.session.idUsu +'/objetos/' + req.params.id).once('value', (snapshot) => {
        var values = snapshot.val();

        if(values.tipo == "image/png" || values.tipo == "image/jpeg")
        {
            var file = Buffer.from(values.datos, 'base64');
            res.writeHead(200, {
              'Content-Disposition':"attachment; filename=" +  values.nombre,  
              'Content-Type': values.tipo,
              'Content-Length': file.length
            });
            res.end(file);
        }
        else
        {
            res.set({"Content-Disposition":"attachment; filename=" + values.nombre});
            res.send(values.datos);
        }

    });
});

// Request para eliminar un objeto con el id pasado por la url.
router.get('/delete-object/:id', (req, res) => {
    db.ref('usuarios/'+ req.session.idUsu +'/objetos/' + req.params.id).remove(); // Hace una petición a la base de datos con la colección/laIdDelObjeto para eliminarlo.
    res.redirect('/');
}); 


router.post('/share/:id', (req, res) => {
    // Primero saco la pkey del usuario con su email.
    // db.ref('usuarios/').orderByKey().startAt(req.body.email).once('value', (snapshot) => {

    db.ref('/usuarios').orderByChild('email').equalTo(req.body.email).once('value', (snapshot) => {
            var userPkey;
            var userId;
            console.log(snapshot.val());
            snapshot.forEach(function (childSnapshot) {
                var value = childSnapshot.val();
                userId = childSnapshot.key;
                userPkey = value.pkey;
            });

        // hago una petición a la base de datos própia para sacar el archivo, encriptarlo y mandarlo al nuevo usuario
        db.ref('usuarios/'+ req.session.idUsu +'/objetos/' + req.params.id).once('value', (snapshot) => {
            var values = snapshot.val();
            // primero desencripto los archivos
            // desencriptar la contraseña
            var publicKey = cryptico.generateRSAKey(req.session.pass, Bits);
            var decryptedPass = cryptico.decrypt(values.clave, publicKey);
            
            //console.log(decryptedPass);
            // Compruebo si es un archivo o un texto.
            var encryptPassword = cryptico.encrypt(decryptedPass.plaintext, userPkey);
            //console.log(encryptPassword);
            // los encripto con la clave del otro usuario

            // los coloco en el objeto
            var cipherObject = {
                datos: values.datos,
                nombre: values.nombre,
                clave: encryptPassword.cipher,
                tipo: values.tipo
            };

            // subo el objeto
            db.ref('usuarios/'+ userId +'/objetos' ).push(cipherObject); // Subo el objeto a la base de datos.
        });

    });
    res.redirect('/');    
})
module.exports = router; // Exporto el objeto router.




