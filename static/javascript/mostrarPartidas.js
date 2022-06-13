function mostrarParidas(){
    $.ajax({
        url:`/perfil/${region}/${invocador}/partida`,
        type:"get",
        dataType:"json",
        success: function (response){
            sacarSummoners(1)
            for(clave in response){
                pintarPartida(response[clave])
            }

        },
        error:function (response){
            alert("no se pudo acceder al json")
        }
    })
}

$(document).ready(function (){
    mostrarParidas()
})



function pintarPartida(idPartida){
    const invocadorPrincipal = document.getElementById('nombreInvocadorCapt').innerHTML

    listaDePartidas = document.getElementById('listaDePartidas')
    let partida = document.createElement('li')


    let datoDePartidaDIV = document.createElement('div')
    datoDePartidaDIV.classList.add('datoDePartidaDIV')


    let imagenDePersonaje = document.createElement('img')
    let contenedroPartida = document.createElement('div')

    $.when(sacarTipoPartida()).done(function(response){ // Tipo de Partida
        for(tipo of response){
            if(tipo['queueId'] == idPartida['info']['queueId']){
                parrafo = document.createElement('p')
                if(tipo['description'].includes('ARURF'))
                    parrafo.innerHTML = tipo['description'].replace('5v5', '').replace('vs. AI', '').replace('Bot', '')+"<br>"
                else
                parrafo.innerHTML = tipo['description'].replace('5v5', '').replace('games', '').replace('vs. AI', '').replace('Bot', '')

                datoDePartidaDIV.appendChild(parrafo)
            }
        }
    })//Hecho Tipo de partida

    for(jugadores of idPartida['info']['participants']){ //El Jugador principal
            if(jugadores['summonerName'] == invocadorPrincipal ){

                jugadores['win'] ? partida.classList.add('ganada') : partida.classList.add('perdida')

                imagenDePersonaje.src =  sacarImagenDeChampById(jugadores['championId'])

                nivel = document.createElement('span')
                nivel.classList.add('nivelDePersonaje')
                nivel.innerHTML = jugadores['champLevel']
                datoDePartidaDIV.appendChild(nivel)

               $.when(sacarSummoners()).done(function(response){ // Tipo de Partida
                      for(sums in response['data']){
                       sumKey = response['data'][sums]['key']
                       if(sumKey == jugadores['summoner1Id'] || sumKey == jugadores['summoner2Id']){
                            imagenDeSummoner = document.createElement('img')
                           imagenDeSummoner.classList.add('summoner')
                           imagenDeSummoner.src = sacarImagenDeSummoner(response['data'][sums]['id'])
                           partida.appendChild(imagenDeSummoner)
                       }
                }
                })//Summoner imgs

               score = document.createElement('p')
                score.classList.add('score')
                score.innerHTML = `${jugadores['kills']}/${jugadores['deaths']}/${jugadores['assists']}`
                partida.appendChild(score)

                 items = ['item0','item1','item2','item3','item4','item5','item6']
                divItems = document.createElement('div')
                divItems.classList.add('divItems')
                for(itemS in items){
                    if(jugadores[items[itemS]] != 3340 && jugadores[items[itemS]] != 0 ) {
                        imgItems = document.createElement('img')
                        imgItems.src = `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/item/${jugadores[items[itemS]]}.png`
                    }

                    if(itemS == 3)
                        divItems.innerHTML+='<br>'
                    divItems.appendChild(imgItems)
    }
                partida.appendChild(divItems)
            }
    }//Hecho Imagen


    let equipo1 = document.createElement('ul')
        for(let i = 0; i<5 ;i++){
            let rol = document.createElement('li')
             let champ = sacarImagenDeChampById(idPartida['info']['participants'][i]['championId'])
            rol.innerHTML = `<a href='/perfil/${idPartida['info']['platformId'].toLowerCase()}/${idPartida['info']['participants'][i]['summonerName']}'> ${idPartida['info']['participants'][i]['summonerName']}<img src=${champ}></img></a>`
            equipo1.appendChild(rol)
        }

    let equipo2 = document.createElement('ul')
         for(let i = 5; i<10 ;i++){
            let rol = document.createElement('li')
             let champ = sacarImagenDeChampById(idPartida['info']['participants'][i]['championId'])
              rol.innerHTML = `<a href='/perfil/${idPartida['info']['platformId'].toLowerCase()}/${idPartida['info']['participants'][i]['summonerName']}'> ${idPartida['info']['participants'][i]['summonerName']}<img src=${champ}></img></a>`
            equipo2.appendChild(rol)
        }



    divDePersonajes = document.createElement('div')
    divDePersonajes.classList.add('divDePersonajes')
    divDePersonajes.appendChild(equipo1)
    divDePersonajes.appendChild(equipo2)
    partida.appendChild(divDePersonajes)
    datoDePartidaDIV.appendChild(imagenDePersonaje)
    partida.appendChild(datoDePartidaDIV)



    listaDePartidas.appendChild(partida) //Partida completa
    console.log(idPartida)
}



function sacarTipoPartida(){
    return  $.ajax({
            url:`https://static.developer.riotgames.com/docs/lol/queues.json`,
            type:"get",
            dataType:"json"})
}

function sacarImagenDeChamp(champ){
    return `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${champ}.png`
}

function sacarImagenDeChampById(champ){
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ}.png`
}

function sacarImagenDeSummoner(sumId){
    return `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/spell/${sumId}.png`
}

function  sacarSummoners(){
   return  $.ajax({
         url:`http://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/summoner.json`,
            type:"get",
          dataType:"json"})
}

//
// function  sacarRunas(){
//    return  $.ajax({
//          url:`http://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/runesReforged.json`,
//             type:"get",
//           dataType:"json"})
// }