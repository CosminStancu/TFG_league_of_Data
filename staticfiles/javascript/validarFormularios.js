$(window).on('load', function (){
    $('#botonRegistrar').on({
        click:validar
    })
})
//TODO mirar tiempo de respuesta/mirar como evitar que carge el dato
if(errores.innerHTML != "{}"){
    if(errores.innerHTML.includes("userError")){
        alert("El usuario ya existe")
        document.getElementById("id_username").value = ""
    }

    if(errores.innerHTML.includes("emailError")){
        alert("El email ya existe")
        document.getElementById("id_email").value = ""
    }

}

function validar(e){

    let email = $("#id_email").val()
    let usuario = $("#id_username").val()
    let contrasenia = $("#id_password1").val()
    let contrasenia2 = $("#id_password2").val()
    //TODO mirar mensajes de vuelta

    if(email.indexOf("@")==-1 || email.lastIndexOf(".")==-1){
        alert("Introduce un mail valido")
        return false
    }else if(usuario.length < 5) {
        alert("El usuario deberia tener minimo 5 caracteres")
        return false
    }else if(contrasenia.length<8){
        alert("La contraseña tiene que tener mas de 8 caracteres")
        return false
    }else if(contrasenia2 != contrasenia){
        alert("La contraseña repetida no es igual")
        return false
    }

    return true
}