$(window).on('load', function (){
    $('#regionId').on({
        focus:cambiaColor,
        blur:cambiaColor
    }),
        $('#invocadorInput').on({
        focus:cambiaColor,
        blur:cambiaColor
    })
})

function cambiaColor(){
    document.getElementById('formIndex').classList.toggle('bgColor')
     document.getElementById('regionId').classList.toggle('placeholderNegro')
     document.getElementById('invocadorInput').classList.toggle('placeholderNegro')
    document.getElementById('buttonBusca').classList.toggle('placeholderNegro')
}