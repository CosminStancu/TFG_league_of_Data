window.addEventListener('load', cargarFunciones)

function cargarFunciones(){
    exitsUser()
    confirmacionRegistro()
}
function exitsUser(){
    if(document.getElementById('errorLoginCredentials').innerText.includes('Invalid')) {
        if(document.getElementById('errorLoginCredentials').innerText.includes('Created'))
          document.getElementById('errorLoginCredentials').innerText = document.getElementById('errorLoginCredentials').innerText.replace('User Created',"")
        document.getElementById('errorLoginCredentials').style.display = 'block'
        document.getElementById('errorLoginCredentials').style.color = 'red'
    }
}
function confirmacionRegistro(){
    if(document.getElementById('errorLoginCredentials').innerText.includes('Created')) {
        if(document.getElementById('errorLoginCredentials').innerText.includes('Invalid'))
          document.getElementById('errorLoginCredentials').innerText = document.getElementById('errorLoginCredentials').innerText.replace('Invalid credentials',"")
        document.getElementById('errorLoginCredentials').style.display = 'block'
        document.getElementById('errorLoginCredentials').style.color = 'black'
    }
}