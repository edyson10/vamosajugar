var myApp = new Framework7();
var $$ = Dom7;
var correoRegistro = "";
var idCancha = "";
var link = "http://192.168.0.13/VamoAJugarService/";
var atras = "true";
var tituloMensajes = "Vamo' a Jugar le informa:"

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

//PRELOADER
window.addEventListener('load', function () {
    setTimeout(function() {
        $("#cover").fadeOut(500);
    },1000);
});

$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

//ACCION BOTON ATRAS
$$(document).on('backbutton', function(e){ 
    if(atras==="true"){
        $$('#botonatraspordefecto').click();
        e.preventDefault();
    }
}); 

//CERRAR SESION
$$("#botonCerrarSesion").click(function(){
    localStorage.removeItem("session");
    window.location.reload(true);
    mainView.router.loadPage('index.html');
});


//METODOS DE LA VISTA INDEX
myApp.onPageInit('index', function (page) {
    atras = "false";
});

//METODOS DE LA VISTA DE REGISTRO
myApp.onPageInit('registro', function (page) {
    $$('#botonRegistrarme').click(function(){        
        var nom = $$('#nombreRegistro').val();     
        var ape = $$('#apellidoRegistro').val();     
        var tel = $$('#celularRegistro').val();     
        var cor = $$('#emailRegistro').val();     
        var con = $$('#claveRegistro').val(); 
        if(nom===""||ape===""||tel===""||cor===""||con===""){
            alertaMensaje("Vamo a Jugar Informa:","Debe ingresar todos los datos");
        }else{
            $.ajax({
                type: "GET",
                url: link+"registrarJugador.php?nombres="+nom+"&apellidos="+ape+
                "&celular="+tel+"&email="+cor+"&clave="+con,
                cache: false,
                datatype: "text",

                success: function (data)
                {
                    if(data==="true"){
                        $$('#nombreRegistro').val("");     
                        $$('#apellidoRegistro').val("");     
                        $$('#celularRegistro').val("");     
                        $$('#emailRegistro').val("");     
                        $$('#claveRegistro').val("");
                        mainView.router.loadPage('informacionjugador.html');
                        correoRegistro = cor;
                    }else{ 
                        alertaError(tituloMensajes,data);
                    }
                },
            }); 
        }
    }); 
});


//METODOS DE LA VISTA DE INFORMACION DE JUGADOR
myApp.onPageInit('informacionjugador', function (page) {
    $$('#botonContinuarInfoJugador').on('click', function () {          
        var genero = $$('#selectGenero').val();     
        var fecha = $$('#fechaNacimientoRegistro').val();     
        var posicion = $$('#selectPosicion').val(); 
        if(genero==="Género"||posicion==="Posición"||fecha===""){
            alertaMensaje("Vamo a Jugar Informa:","Seleccione los datos requeridos");
        }else{
            $.ajax({
                type: "GET",
                url: link+"registrarJugador.php?correo="+correoRegistro+"&genero="+genero+
                "&fecha="+fecha+"&posicion="+posicion,
                cache: false,
                datatype: "text",

                success: function (data)
                {
                    if(data==="true"){
                        $$('#selectGenero').val("");     
                        $$('#fechaNacimientoRegistro').val("");     
                        $$('#selectPosicion').val("");
                        mainView.router.loadPage('dondeJuega.html');
                    }else{ 
                        alertaError(tituloMensajes,data);
                    }
                },
            }); 
        }
    });
});


//METODOS DE LA VISTA DE DONDE JUEGA
myApp.onPageInit('dondeJuega', function (page) {
    $.ajax({
        type: "GET",
        url: link+"registrarJugador.php?cargarPaises=true",
        cache: false,
        datatype: "text",

        success: function (data)
        {
            var select = document.getElementById('selectPais');
            var temp = data.split("/");
            var salida = "<option selected hidden>País</option>";
            for (var i = 0; i < temp.length-1; i++) {
                var opt = document.createElement('option');
                opt.value = temp[i].split("-")[0];
                opt.innerHTML = temp[i].split("-")[1];
                select.appendChild(opt);
            }
        },
    }); 

    $$("#selectPais").change(function (){
        var id = $$('#selectPais').val();
        $.ajax({
            type: "GET",
            url: link+"registrarJugador.php?cargarDepartamentos="+id,
            cache: false,
            datatype: "text",
            success: function (data)
            {
                var select = document.getElementById('selectDepartamento');
                var temp = data.split("/");
                var salida = "<option selected hidden>Departamento</option>";
                for (var i = 0; i < temp.length-1; i++) {
                    salida += "<option value='"+temp[i].split("-")[0]+"'>"+temp[i].split("-")[1]+"</option>"
                } 
                select.innerHTML = salida;
            },
        });
    }); 

    $$("#selectDepartamento").change(function (){
        var id = $$('#selectDepartamento').val();
        $.ajax({
            type: "GET",
            url: link+"registrarJugador.php?cargarCiudades="+id,
            cache: false,
            datatype: "text",
            success: function (data)
            {
                var select = document.getElementById('selectCiudad');
                var temp = data.split("/");
                var salida = "<option selected hidden>Ciudad</option>";
                for (var i = 0; i < temp.length-1; i++) {
                    salida += "<option value='"+temp[i].split("-")[0]+"'>"+temp[i].split("-")[1]+"</option>"
                }
                select.innerHTML = salida;
            },
        });
    });

    $$('#botonContinuarDondeJuega').on('click', function () { 
        var pais = $$('#selectPais').val();
        var dep = $$('#selectDepartamento').val();
        var ciudad = $$('#selectCiudad').val();
        var barrio = $$('#barrioRegistro').val();
        if(pais==="Pais" || dep==="Departamento" || ciudad==="Ciudad"){
            alertaMensaje(tituloMensajes,"Seleccione los datos solicitados")
        }else{
            $.ajax({
                type: "GET",
                url: link+"registrarJugador.php?pais="+pais+"&departamento="+dep+"&ciudad="+ciudad+"&barrio="+barrio+"&correo="+correoRegistro,
                cache: false,
                datatype: "text",
                success: function (data)
                {
                    if(data==="true"){
                        $$('#selectPais').val("Pais");
                        $$('#selectDepartamento').val("Departamento");
                        $$('#selectCiudad').val("Ciudad");
                        $$('#barrioRegistro').val("");
                        mainView.router.loadPage('habilidades.html');
                    }else{ 
                        alertaError(tituloMensajes,data);
                    }
                },
            });
        }
    });
});


//METODOS DE LA VISTA DE HABILIDADES
myApp.onPageInit('habilidades', function (page) {
    $$('#botonRegistarHabilidades').click(function(){  
        var fuerza = $$('#rangoFuerza').val();  
        var ataque = $$('#rangoAtaque').val();  
        var defensa = $$('#rangoDefensa').val();  
        var resistencia = $$('#rangoResistencia').val();  
        var tecnica = $$('#rangoTecnica').val();  
        var descripcion = $$('#descripcionRegistro').val();  
        var logro = $$('#logroRegistro').val();
        $.ajax({
            type: "GET",
            url: link+"registrarJugador.php?fuerza="+fuerza+"&ataque="+ataque+"&defensa="+defensa
            +"&resistencia="+resistencia+"&tecnica="+tecnica+"&descripcion="+descripcion+"&logro="+logro+"&correo="+correoRegistro,
            cache: false,
            datatype: "text",
            success: function (data)
            {                  
                if(data==="true"){
                    $$('#descripcionRegistro').val("");  
                    $$('#logroRegistro').val("");
                    mainView.router.loadPage('fotoPerfil.html');
                }else{ 
                    alertaError(tituloMensajes,data);
                }
            },
        });
    });
});


//METODOS DE LA VISTA DE FOTO DE PERFIL
myApp.onPageInit('fotoPerfil', function (page) {
    $$("#saltarPasoFotoPerfil").click(function(){
        alertaExito("","Te has registrado con éxito!");
        mainView.router.loadPage('iniciarsesion.html');       
    });
    $$('#botonRegistarFotoPerfil').click(function(){  
        swal("En estos momentos no está habilitada ésta función.\n\nPor favor intentélo más tarde.")
        .then((value) => {
            alertaExito("","Te has registrado con éxito!");
            mainView.router.loadPage('iniciarsesion.html'); 
        });
    });
});


//METODOS DE LA VISTA INICIAR SESION
myApp.onPageInit('iniciarsesion', function (page) {
    $$("#botonIniciarSesion").click(function(){
        var correo = $$('#logueoCorreo').val();
        var clave = $$('#logueoClave').val();
        if(correo==="" || clave===""){
            alertaMensaje(tituloMensajes,"Ingrese los datos requeridos.");
        }else{
            $.ajax({
                type: "GET",
                url: link+"loguear.php?correo="+correo+"&clave="+clave,
                cache: false,
                datatype: "text",
                success: function (data)
                {             
                    if(data==="false"){
                        alertaError(tituloMensajes,"Revise los datos e intentélo de nuevo.");                    
                    }else{ 
                        $$('#logueoCorreo').val("");  
                        $$('#logueoClave').val("");
                        localStorage.setItem("session", data);
                        alertaExito("Bienvenido!","");
                        mainView.router.loadPage('inicio.html');
                    }
                },
            });
        }    
    });
});



//METODOS DE LA VISTA INICIO
myApp.onPageInit('inicio', function (page) {
    atras = "false";
    $.ajax({
        type: "GET",
        url: link+"inicio.php?datosUsuarioLogueado="+localStorage.getItem("session"),
        cache: false,
        datatype: "text",
        success: function (data)
        {             
            var usuario = data.split("/")[1]+" "+data.split("/")[2];
            document.getElementById("nombrePanel").innerHTML = usuario;
        },
    });
});


//METODOS DE LA VISTA MENU CANCHAS
myApp.onPageInit('miperfil', function (page) {
    atras = "true";
    $.ajax({
        type: "GET",
        url: link+"inicio.php?datosUsuarioLogueado="+localStorage.getItem("session"),
        cache: false,
        datatype: "text",
        success: function (data)
        {             
            document.getElementById("nombrePerfil").innerHTML = data.split("°")[1]+" "+data.split("°")[2];
            document.getElementById("fechaPerfil").innerHTML = data.split("°")[7];
            document.getElementById("generoPerfil").innerHTML = data.split("°")[6];
            document.getElementById("posicionPerfil").innerHTML = data.split("°")[8];
            document.getElementById("ataquePerfil").innerHTML = data.split("°")[10]+"%";
            document.getElementById("defensaPerfil").innerHTML = data.split("°")[11]+"%";
            document.getElementById("resistenciaPerfil").innerHTML = data.split("°")[12]+"%";
            document.getElementById("fuerzaPerfil").innerHTML = data.split("°")[9]+"%";
            document.getElementById("tecnicaPerfil").innerHTML = data.split("°")[13]+"%";
            document.getElementById("imagenPaisPerfil").src = data.split("°")[14];
            if((data.split("°")[15])===""){
                document.getElementById("equipoPerfil").innerHTML = "¡ SIN EQUIPO !";
                document.getElementById("espacionBotonEquipoPerfil").innerHTML = "<button class='button col' style='border:2px solid black; background:#4caf50; color:white; margin-right: 7%;' id='crearEquipoPerfil'>crear equipo</button> ";
            }else{
                document.getElementById("equipoPerfil").innerHTML = data.split("°")[15];
                document.getElementById("espacionBotonEquipoPerfil").innerHTML = "";
            }
        },
    });
});



//METODOS DE LA VISTA LISTADO DE CANCHAS
myApp.onPageInit('listadoCanchas', function (page) {
    atras = "true";
    $.ajax({
        type: "GET",
        url: link+"canchas.php?listarCanchas",
        cache: false,
        datatype: "text",
        success: function (data)
        {             
            var select = document.getElementById('listadoCanchas');
            var temp = data.split("°");
            var salida = "";
            for (var i = 0; i < temp.length-1; i++) {
                salida += "<div class='block'> "+
                            "<div class='row'>"+
                                "<a id='"+temp[i].split("/")[0]+"' href='perfilCancha.html' style='padding: 2%; width: 100%; height: 90px; border-radius: 20px 20px 20px 20px;border: 1px solid black;  margin-top: 10%;  background:#F2F4F4;text-align: center; color: black;'>"+
                                  "<h3>"+temp[i].split("/")[1]+"</h3>"+
                                  "<hr><h3>"+temp[i].split("/")[2]+"</h3>"+
                                  "<h3>Tipo: "+temp[i].split("/")[3]+"</h3>"+
                                "</a>"+
                              "</div>"+
                            "</div>";
            }
            select.innerHTML = salida;
        },
    });
    $('#listadoCanchasVista').on('click', 'a', function(){        
        idCancha = $$(this).attr('id');
    });
});


//METODOS DE LA VISTA PERFIL DE CANCHAS
myApp.onPageInit('perfilCancha', function (page) {
    atras = "true";
    $.ajax({
        type: "GET",
        url: link+"canchas.php?buscarCanchaPorId="+idCancha,
        cache: false,
        datatype: "text",
        success: function (data)
        {             
            document.getElementById("nombreCanchaPerfil").innerHTML = data.split("°")[1];
            document.getElementById("tipoCanchaPerfil").innerHTML = "Tipo "+data.split("°")[4];
            document.getElementById("fotoCanchaPerfil").src = data.split("°")[6];
            switch(data.split("°")[3]){
                case "0": document.getElementById("calificacionCanchaPerfil").innerHTML = "<i class='material-icons' style='color: white;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: white;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: white;'>star_rate</i>";break;
                case "1": document.getElementById("calificacionCanchaPerfil").innerHTML = "<i class='material-icons' style='color: yellow;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: white;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: white;'>star_rate</i>";break;
                case "2": document.getElementById("calificacionCanchaPerfil").innerHTML = "<i class='material-icons' style='color: yellow;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: yellow;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: white;'>star_rate</i>";break;
                case "3": document.getElementById("calificacionCanchaPerfil").innerHTML = "<i class='material-icons' style='color: yellow;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: yellow;'>star_rate</i>"+
                                                                                    "<i class='material-icons' style='color: yellow;'>star_rate</i>";break;
            }          
        },
    });

    $.ajax({
        type: "GET",
        url: link+"canchas.php?buscarHorarioCanchaPorId="+idCancha,
        cache: false,
        datatype: "text",
        success: function (data)
        {             
            var select = document.getElementById('cuerpoTablaHorarios');
            var temp = data.split("°");
            if((temp.length-1)===0){
               select.innerHTML = "<tr>No hay horarios disponibles</tr>"; 
            }else{
                var salida = "";
                for (var i = 0; i < temp.length-1; i++) {
                    salida += "<tr><td class='label-cell' style='text-align: center;'>"+temp[i].split("/")[1]+"</td>"+
                                "<td class='label-cell' style='text-align: center;'>"+temp[i].split("/")[0]+"</td>"+
                                  "<td class='numeric-cell' style='text-align: center;'>"+temp[i].split("/")[2]+"</td>"+
                                  "<td class='checkbox-cell' style='text-align: center;'>"+
                                    validarEstadoHorarioCancha(temp[i].split("/")[3],temp[i].split("/")[4])+
                                  "</td></tr>";}
                select.innerHTML = salida;
                $('.apartarCancha').click(function(){ 
                   var x = $$(this).attr('id');

                   $.ajax({
                        type: "GET",
                        url: link+"canchas.php?apartarCancha="+x+"&correo="+localStorage.getItem("session"),
                        cache: false,
                        datatype: "text",
                        success: function (data)
                        {             
                            
                        },
                    });

                }); 
            }  
        },
    });

    function validarEstadoHorarioCancha(x,id){
        var respuesta = "";
        if(x==="DISPONIBLE"){
            respuesta = "<a class='button col apartarCancha' style='background:green;color:white;text-align:center;' id='"+id+"'>"+
                            "<i class='material-icons'>thumb_up_alt</a>";
        }else{
            respuesta = "<a class='button col apartarCancha' style='background:red;color:black;text-align:center;' disabled>"+
                            "<i class='material-icons'>thumb_down_alt</a>";
        }
        return respuesta;
    }
});