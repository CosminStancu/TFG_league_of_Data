window.addEventListener('load',cargarFunciones)
function cargarFunciones(){
    cargarLista()
    document.getElementById("buscadorDePj").addEventListener('keyup', busqueda)
    document.getElementById("imagenCampeon").addEventListener('click', busqueda)

}

function cargarLista(){

    $.ajax({
        url:`/championData/campeones`,
        type:"get",
        dataType:"json",
        success: function (response){
           for(cp in response['data']){

            let li = document.createElement('li')
            let p = document.createElement('p')
               if(response['data'][cp]['name'].includes("Bel'Veth"))
                   continue
            let img = document.createElement('img')
            img.src = "/static/imagenes/championDataResources/champion/"+response['data'][cp]['key']+".png"
            p.innerHTML = response['data'][cp]['name']
            li.classList.add('opt')
            li.value = response['data'][cp]['key']
            li.appendChild(img)
            li.appendChild(p)
            document.getElementById("listaDePersonajes").appendChild(li)
               seleccionar()
               abrirYCerrarNiveles()
               abrirYCerrar()
            }
        },
        error:function (response){
            alert("no se pudo acceder al json")
        }
    })
}



function busqueda() {
    let input = document.getElementById('buscadorDePj');
    let filtro = input.value.toUpperCase();
    let ul = document.getElementById("listaDePersonajes");
    let li = ul.getElementsByTagName('li');
    
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filtro) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }


function seleccionar(){
    let imagen = document.getElementById("imagenCampeon")
    let optionss = document.getElementsByClassName("opt")
    let lista = document.getElementById("listaDePersonajes")

    for(option of optionss){
      option.onclick = function(){
        imagen.src = "/static/imagenes/championDataResources/champion/"+this.value+".png"
        lista.classList.toggle("esconder")
        document.getElementById("nombreDePersonaje").innerHTML = this.textContent
          //getChampionDataTooltips()
          getSpecificChampionData()
          añadirScroll()
          document.getElementById('buscadorDePj').value = ""
          document.getElementById("tablaDeDatos").classList.remove('tablaInvisible')
      }
    }

}

function abrirYCerrar(){
      let imagen = document.getElementById("imagenCampeon")
      let lista = document.getElementById("listaDePersonajes")
       imagen.onclick = function(){
     lista.classList.toggle("esconder")
     }

}

function abrirYCerrarNiveles(){
      let selector = document.getElementById("selectorNivelField")
      let lista = document.getElementById("listaNiveles")
       selector.onclick = function(){
     lista.classList.toggle("esconder")
     }
}


function getSpecificChampionData(){
    let pj = document.getElementById("nombreDePersonaje").innerText.replace(/ /g,'').toLowerCase()
    switch (pj){
        case pj.includes("wukong"):
            pj = "monkeyking"
            break;
    }
    pj = pj.replace(/\.|'/g,"")

    $.ajax({
        url:`/championData/campeonesDanio/${pj}`,
        type:"get",
        dataType:"json",
        success: function (response){
            rellenardatos(response)
            cambiarFondo(response)
            rellenarEstadisticasBase(response)
            clickEnNivel(response)
        },
        error:function (response){
            alert("no se pudo acceder al json")
        }
    })
}


function rellenardatos(response){

    let hablidades = ["P", "Q", "W", "E", "R"]

    for(let i = 0; i< 5;i++) {

        document.getElementById(`habil${i}`).innerHTML = response['abilities'][hablidades[i]][0]['name']
        document.getElementById(`habilDesc${i}`).innerHTML = response['abilities'][hablidades[i]][0]['effects'][0]['description']
        document.getElementById(`${i}ImgTd`).setAttribute('data-label', ((i == 0)? "Pasiva" : `Habilidad ${hablidades[i]}`)  )
        document.getElementById(`${i}Img`).src = response['abilities'][hablidades[i]][0]['icon']

        //COOLDOWN CALC
        let cdBase = ""
        if(response['abilities'][hablidades[i]][0]['cooldown'] != null) {
            if(response['abilities'][hablidades[i]][0]['rechargeRate'] != null){
                for (rechargeTime of response['abilities'][hablidades[i]][0]['rechargeRate']){
                    cdBase += rechargeTime + "/"
                }
            }else{
                for (allCds of response['abilities'][hablidades[i]][0]['cooldown']['modifiers'])
                for(cdByLvl of allCds['values']) {
                    if(allCds['values'].length > 12) {
                        cdBase = `From ${allCds['values'][0]} to ${allCds['values'][allCds['values'].length-1]} between level 1 and 18/`
                    }else {
                        if(cdByLvl.toString().includes("."))
                            cdBase += Number(cdByLvl).toPrecision(2) + "/"
                        else
                            cdBase += cdByLvl + "/"
                    }
                }
            }

        }
        else
            cdBase = "No Cooldown/"
        document.getElementById(`cd${i}`).innerHTML = cdBase.replace(/.$/,"s")


        //MANA CALC
        let mana = ""
        let manaFinal = ""
        let textoFinal = ""
        let unidad = ""
        let manaData =  document.getElementById(`mana${i}`)
        if(response['abilities'][hablidades[i]][0]['cost'] != null){
            mana = response['abilities'][hablidades[i]][0]['cost']['modifiers'][0]['values']
            let units = response['abilities'][hablidades[i]][0]['cost']['modifiers'][0]['units'][0]
            if(units != "")
                unidad = units
            for(val of mana){
                manaFinal += val + "/"

            }
            switch (response['abilities'][hablidades[i]][0]['resource']){
            case "ENERGY":
                textoFinal = `<energia>${manaFinal.slice(0, -1)} ${unidad}<br> energy</energia>`
                break;
            case "MANA":
                textoFinal = `<mana>${manaFinal.slice(0, -1)} ${unidad}<br> mana </mana>`
                break;
            case "HEALTH":
                textoFinal = `<health>${manaFinal.slice(0, -1)} ${unidad}<br> health</health>`
                break;
            case "CURRENT_HEALTH":
                textoFinal = `<currentHealth>${manaFinal.slice(0, -1)} ${unidad}<br> current health </currentHealth>`
                break;
                case "OTHER":
                    textoFinal = `<other>${manaFinal.slice(0, -1)} ${unidad}<br> ${unidad}</other>`
                    break;
                case "MANA_PER_SECOND":
                    textoFinal = `<mana>${manaFinal.slice(0, -1)} ${unidad}<br> mana per second</mana>`
                    break;
                case "MAXIMUM_HEALTH":
                    textoFinal = `<health>${manaFinal.slice(0, -1)} ${unidad}<br> maximum health </health>`
                    break;
                case "FURY":
                    textoFinal = `<fury>${manaFinal.slice(0, -1)} ${unidad}<br> fury</fury>`
                    break;
                case "GRIT":
                    textoFinal = `<fury>${manaFinal.slice(0, -1)} ${unidad}<br> damage amplification</fury>`
                        break;
                case null :
                    textoFinal = `<fury>${manaFinal.slice(0, -1)} ${unidad}</fury>`
                    break;
        }
            manaData.innerHTML = textoFinal


        }else{
            document.getElementById(`mana${i}`).innerHTML = "<nocost>No Cost</nocost>"
        }

        calcularDanios(response)
    }
}

function clickEnNivel(response){
    let textLevel = document.getElementById('nivelSelec')
    let optLevel = document.getElementsByClassName('optionLevel')
    let listaNivel = document.getElementById("listaNiveles")
    for(option of optLevel){
        option.onclick = function (){
            textLevel.innerHTML = this.textContent
            listaNivel.classList.toggle("esconder")
            rellenarEstadisticasBase(response)
        }
    }
}

function rellenarEstadisticasBase(response){

    let tipoDeStat = ['health','healthRegen','mana','manaRegen','criticalStrikeDamage','attackRange','armor','magicResistance','attackDamage','movespeed','attackSpeed', 'attackSpeedRatio']
    let reg = /\d+/g
    for(stat in tipoDeStat){
        document.getElementById(`stat${stat}`).innerHTML = (response['stats'][tipoDeStat[stat]]['flat'] + (response['stats'][tipoDeStat[stat]]['perLevel']*(document.getElementById('nivelSelec').innerText.match(reg)))).toFixed(1)
    }

    recurso = response['resource'].toLowerCase().replace("_","")
    document.getElementById('recurso').innerHTML = "Recurso de "+ recurso.charAt(0).toUpperCase() + recurso.slice(1);
    document.getElementById("baseStat").style.visibility = "visible"

}

function calcularDanios(response){
    let hablidades = ["P", "Q", "W", "E", "R"]

    for(let i = 0; i< 5;i++) {

    let dañoTotal = ""
        if(response['abilities'][hablidades[i]][0]['effects'] != null ){
            document.getElementById(`daño${i}`).innerHTML = ""
            efectosDeAbilidad = response['abilities'][hablidades[i]][0]['effects']
            for(efecto of efectosDeAbilidad){
                if(efecto['leveling'] != "") {
                    document.getElementById(`daño${i}`).style.display = "block"
                    elementByLevel = efecto['leveling']
                    for(el of elementByLevel) {
                        if(el['attribute'].toLowerCase().includes("minion") || el['attribute'].toLowerCase().includes("capped") )
                            continue

                        document.getElementById(`daño${i}`).innerHTML += " "+el['attribute'] + " - "
                        datos = el['modifiers']

                            for(dañoByLvl of datos[0]['values']){
                                 if(dañoByLvl.toString().includes(".")) {
                                     dañoTotal += dañoByLvl.toPrecision(3) + "/"
                                 }
                                else
                                    dañoTotal += dañoByLvl+"/"
                            }
                            dañoTotal = dañoTotal.slice(0, -1)+ datos[0]['units'][0]
                            document.getElementById(`daño${i}`).innerHTML += dañoTotal+"<br>"
                        dañoTotal = ""
                    }
                }
            }
        }
}
}
function cambiarFondo(response){
    if(!document.getElementById("parallaxBuildMaker").style.backgroundImage.includes(response['id'])) {
        let skinVal = response['skins'][Math.floor(Math.random() * response['skins'].length)]['splashPath']
        document.getElementById("parallaxBuildMaker").style.backgroundImage = `url(${skinVal})`
    }
}


function añadirScroll(){
    document.body.style.overflow = "visible"
}

function select(){

}