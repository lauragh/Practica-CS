


function mensajeModal(key, nombre)
{
    let html,div;
    div = document.createElement('div');
    div.classList.add('modal');
    div.setAttribute("id","ventana");

    html =  '<div style="top: 15%" class="modal-dialog" role="document">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<h5>Descargar '+ nombre + '</h5>';
    html += '<button onclick="ventana.remove();" type="button" class="close" data-dismiss="modal" aria-label="Close">';
    html += '<span aria-hidden="true">&times;</span>';
    html += '</button>';
    html += '</div>';
    html += '<div style="text-align: center" class="modal-body">';
    html += '<a style="border-right-width: 1px;margin-right: 5%" href="/download-encrypted-object/'+key+'" class="btn btn-success">Encriptado</a>';
    html += '<a href="/download-decrypted-object/'+key+'" class="btn btn-success">Desencriptado</a>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    div.innerHTML = html;

    document.getElementById('inicio').appendChild(div);
    document.getElementById('ventana').style.display="block";

}

function shareModal(key)
{
    let html,div;
    div = document.createElement('div');
    div.classList.add('modal');
    div.setAttribute("id","ventana");

    html =  '<div style="top: 15%" class="modal-dialog" role="document">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<button onclick="ventana.remove();" type="button" class="close" data-dismiss="modal" aria-label="Close">';
    html += '<span aria-hidden="true">&times;</span>';
    html += '</button>';
    html += '</div>';
    html += '<div style="text-align: center" class="modal-body">';
    html += '<form action="/share/'+key+'" method="POST">'
    html += '<label for="email">Escribe un correo para mandar el archivo:</label>'
    html += '<input type="text" name="email" required>'
    html += '<button class="btn btn-info">Enviar</button>';
    html += '</form>'
    html += '</div>';
    html += '</div>';
    html += '</div>';
    

    div.innerHTML = html;

    document.getElementById('inicio').appendChild(div);
    document.getElementById('ventana').style.display="block";
}

function falloSubirArchivo()
{
    let html,div;

    console.log("ha entrado");
    div = document.createElement('div');
    div.classList.add('modal');
    div.setAttribute("id","ventana");

    html =  '<div style="top: 15%" class="modal-dialog" role="document">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<h5>No has seleccionado ningún archivo</h5>';
    html += '<button onclick="ventana.remove();" type="button" class="close" data-dismiss="modal" aria-label="Close">';
    html += '<span aria-hidden="true">&times;</span>';
    html += '</button>';
    html += '</div>';
    html += '<div style="text-align: center" class="modal-body">';
    html += '<p>Selecciona un archivo para subir haciendo click en la barrita de selección.</p>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    div.innerHTML = html;

    document.getElementById('inicio').appendChild(div);
    document.getElementById('ventana').style.display="block";

}

function errMensaje(pagina, mensaje) 
{
    document.getElementById(pagina).innerHTML = mensaje;
}

function cerrar()
{
	//para cerrar el mensaje modal. 
	document.querySelector('modal').remove();
}

function verContra(objeto, input){
    // var showOjo =   document.getElementById("ojo");
    // var contra = document.getElementById("pass");
    // var repiteContra = document.getElementById("repitePass");
    console.log("asdasd");
    
    if(objeto.className == "icon-eye-off"){
        // showOjo.className = "icon-eye";
        // contra.type = "text";
        // repiteContra.type = "text";
        objeto.className = "icon-eye";
        input.type = "text";
        
    }
    else{
        // showOjo.className = "icon-eye-off";
        // contra.type = "password";
        // repiteContra.type = "password";
        objeto.className = "icon-eye-off";
        input.type = "password";
    }

    

    

}

let cont = 0;
function validatePass()
{
    var Ipass  = document.getElementById("pass");
    var charCheck = document.getElementById("caracteres");
    var mayusCheck = document.getElementById("mayus");
    var numCheck = document.getElementById("num");
    var specialCheck = document.getElementById("especial");

    validations = [
        (Ipass.value.length >= 6),
        (Ipass.value.search(/[A-Z]/) > -1),
        (Ipass.value.search(/[0-9]/) > -1),
        (Ipass.value.search(/[.$&+,:;=?@#_]/) > -1)
    ]

    strenght = validations.reduce((acc, curr) => acc + curr);

    // Comprobar longitud
    if(Ipass.value.length >= 6)
    {
        charCheck.className = "icon-check";
    }
    else
    {
        charCheck.className = "icon-cancel";
    }

    // comprobar las mayusculas
    if(Ipass.value.search(/[A-Z]/) > -1)
    {
        mayusCheck.className = "icon-check";
    }
    else
    {
        mayusCheck.className = "icon-cancel";
    }

    // Comprobar número
    if(Ipass.value.search(/[0-9]/) > -1)
    {
        numCheck.className = "icon-check";
    }
    else
    {
        numCheck.className = "icon-cancel";
    }

    // Comprobar carácter especial
    if(Ipass.value.search(/[.$&+,:;=?@#_]/) > -1)
    {
        specialCheck.className = "icon-check";
    }
    else
    {
        specialCheck.className = "icon-cancel";
    }


    var bar1 = document.getElementById("bar1");
    var bar2 = document.getElementById("bar2");
    var bar3 = document.getElementById("bar3");
    var bar4 = document.getElementById("bar4");
    // Colocamos los valores de la barra
    if(strenght > 0)
    {
        bar1.className = "bar-show bar-1";
    }
    else
    {
        bar1.className = "bar bar-1";
    }

    if(strenght > 1)
    {
        bar2.className = "bar-show bar-2";

    }
    else
    {
        bar2.className = "bar bar-2";
    }

    if(strenght > 2) 
    {
        bar3.className ="bar-show bar-3";
    }
    else
    {   
        bar3.className = "bar bar-3";
    }

    if(strenght > 3)
    {
        bar4.className ="bar-show bar-4"
    }
    else
    {
        bar4.className = "bar bar-4";
    }
}
