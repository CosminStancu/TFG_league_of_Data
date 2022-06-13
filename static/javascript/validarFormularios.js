$(window).on('load', function (){
    $('#botonRegistrar').on({
        click:validar
    })
})

if(errores.innerHTML != "{}"){
    console.log(errores.innerHTML)
    if(errores.innerHTML.includes("userError")){
        document.getElementById('validarUser').innerText = 'Username already in use'
        document.getElementById('validarUser').style.visibility = 'visible'
        document.getElementById("id_username").value = ""
    }

    if(errores.innerHTML.includes("emailError")){
          document.getElementById('validarMail').innerText = 'Mail already in use'
        document.getElementById('validarMail').style.visibility = 'visible'
        document.getElementById("id_email").value = ""
    }

}

function validar(e){
    document.getElementById('validarMail').style.visibility = 'hidden'
    document.getElementById('validarUser').style.visibility = 'hidden'
    document.getElementById('validarPassword').style.visibility = 'hidden'
    let isMailValid = false
    let isPassValid = false
    let isUserValid = false
    let isPassLongValid = false
    let email = $("#id_email").val()
    let usuario = $("#id_username").val()
    let contrasenia = $("#id_password1").val()
    let contrasenia2 = $("#id_password2").val()

    if(email.indexOf("@")==-1 || email.lastIndexOf(".")==-1){
        document.getElementById('validarMail').innerText = 'Insert a valid mail'
        document.getElementById('validarMail').style.visibility = 'visible'
        isMailValid = false
    }else {
        isMailValid = true
    }
    if(usuario.length < 5) {
        document.getElementById('validarUser').innerText = 'Username must have at least 5 characters'
        document.getElementById('validarUser').style.visibility = 'visible'
        isUserValid =  false
    }else{
        isUserValid = true
    }
    if(contrasenia.length<8){
        document.getElementById('validarPassword').innerText = 'Password must be longer than 8 characters'
        document.getElementById('validarPassword').style.visibility = 'visible'
        isPassLongValid = false
    }else{
        isPassLongValid = true
    }
    if(contrasenia2 != contrasenia){
        document.getElementById('validarPassword').innerText = 'Passwords must match'
        document.getElementById('validarPassword').style.visibility = 'visible'
        isPassValid =  false
    }else{
        isPassValid =  true
    }
    return (isMailValid && isPassValid && isUserValid && isPassLongValid)
}