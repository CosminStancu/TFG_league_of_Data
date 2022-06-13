import json

from django.shortcuts import render, redirect
from django.conf import settings
from riotwatcher import LolWatcher, ApiError
from django.http import HttpResponse, JsonResponse

# Create your views here.

lol_watcher = LolWatcher(settings.RIOT_API)

def getIncovador(request, idInvocador, region):

    context = {}
    servidores = {
        'euw1':'europe',
        'eun1':'europe',
        'na1':'americas',
        'kr':'asia'
    }
    listaNiveles = [1, 30, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 10000]

    if request.method == 'POST': #Busqueda de invocador
        try:
            b1 = request.POST.get('invocador')
            region = request.POST.get('regionId')
            b2 = lol_watcher.summoner.by_name(region, str(b1))
            return redirect('perfil:getInvocador', idInvocador=b2['name'], region=region)
        except ApiError as err:
            if err.response.status_code == 403:
                return render(request, 'error.html', context={'error': 'Summoner input was empty'})
            elif err.response.status_code == 404:
                return render(request, 'error.html', context={'error': 'A summoner with that name does not exist',
                                                              'error1':'Did you select the right server?',
                                                              'error2': ' Try searching for the summoner in another region '})
            else:
                raise

    try:
        invocador = lol_watcher.summoner.by_name(region, str(idInvocador))
        context['region'] = region
        #Controlador de version de juego
        v1 = lol_watcher.data_dragon.versions_for_region(region)
        versionData = v1['n']

        #Perfil de invocador
        profileIcon = lol_watcher.data_dragon.profile_icons(versionData['profileicon'])
        context['versionesIcono'] = profileIcon['version']
        context['idIcono'] = profileIcon['data'][str(invocador['profileIconId'])]['image']['full']
        context['invocador'] = invocador

        nivelAux = invocador['summonerLevel']
        for x in listaNiveles:
            if nivelAux < x:
                while nivelAux > aux:
                    nivelAux -= 1
            aux = x

        if nivelAux <= 30:
            nivelAux = 30
        context['aproxNivel'] = nivelAux
        context['cantidadDigito'] = len(str(invocador['summonerLevel']))
        context['ranked'] = rango = lol_watcher.league.by_summoner(region, invocador['id'])
        for ranked in rango:
            if ranked['queueType'] == 'RANKED_SOLO_5x5' or ranked['queueType'] == 'RANKED_FLEX_SR':
                if ranked['queueType'] == 'RANKED_SOLO_5x5':
                    context['winrateSoloq'] = round(ranked['wins'] / (ranked['wins'] + ranked['losses']) * 100)
                    context['soloQeloLevel'] = ranked['tier'] +" "+ ranked['rank']
                    context['soloQWins'] = ranked['wins']
                    context['soloQLosses'] = ranked['losses']
                    context['soloQLp'] = ranked['leaguePoints']

                if ranked['queueType'] == 'RANKED_FLEX_SR':
                    context['winrateFlexq'] = round(ranked['wins'] / (ranked['wins'] + ranked['losses']) * 100)
                    context['flexQeloLevel'] = ranked['tier'] + " " + ranked['rank']
                    context['flexQWins'] = ranked['wins']
                    context['flexQLosses'] = ranked['losses']
                    context['flexQLp'] = ranked['leaguePoints']

        return render(request, 'perfil.html', context)
    except ApiError as err:
        if err.response.status_code == 403:
            return render(request, 'error.html', context={'error': 'Summoner input was empty'})
        elif err.response.status_code == 404:
            return render(request, 'error.html', context={'error': 'A summoner with that name does not exist',
                                                          'error1': 'Did you select the right server?',
                                                          'error2': ' Try searching for the summoner in another region '})
        else:
            raise

def getGameByPlayer(request, region, idInvocador): #EndPoint
    if 'error' in request.session:
        del request.session['error']

    if 'error1' in request.session:
        del request.session['error1']
    servidores = {
        'euw1': 'europe',
        'eun1': 'europe',
        'na1': 'americas',
        'kr': 'asia'
    }
    invocador = lol_watcher.summoner.by_name(region, str(idInvocador))
    partidas = lol_watcher.match.matchlist_by_puuid(servidores[region], invocador['puuid'], 0, 10)
    todasLasPartidas = {}
    for i, pt in enumerate(partidas):
        todasLasPartidas[f'partida{i}'] = lol_watcher.match.by_id(servidores[region], pt)

    if request.is_ajax() or request.user.is_superuser:
        return JsonResponse(todasLasPartidas)
    else:
        request.session['error'] = 'You dont have access to this information.'
        request.session['error1'] = 'If you thing this is wrong, contanct with an administrator'
        return redirect('perfil:getInvocador', region, idInvocador)
