function alertaMensaje(titulo,mensaje){
    swal({
      title: titulo,
      text: mensaje,
      button: "Entendido",
    });
}

function alertaExito(titulo, mensaje) {
    swal({
        title: titulo,
        text: mensaje,
        icon: "success",
        button: "Continuar"
    });
}

function alertaEspera(mensaje) {
    swal({
        text: mensaje,
        buttons: false,
        closeOnClickOutside: true,
        closeOnEsc: true,
        icon: "info"
    });
}

function alertaAdvertencia(titulo, mensaje) {
    swal({
        title: titulo,
        text: mensaje,
        icon: "warning",
        button: "Continuar"
    });
}

function alertaError(titulo, mensaje) {
    swal({
        title: titulo,
        text: mensaje,
        icon: "error"
    });
}