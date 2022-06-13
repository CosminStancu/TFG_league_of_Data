from django.shortcuts import render

# Create your views here.
import json

from django.shortcuts import render, redirect
from django.conf import settings
from riotwatcher import LolWatcher, ApiError
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse

# Create your views here.

lol_watcher = LolWatcher(settings.RIOT_API)

def buildMaker(request):

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
                                                              'error1': 'Did you select the right server?',
                                                              'error2': ' Try searching for the summoner in another region '})
            else:
                raise

    return render(request, 'buildMaker.html')


def champions(request): #EndPoint

    if 'error' in request.session:
        del request.session['error']

    if 'error1' in request.session:
        del request.session['error1']

    versions = lol_watcher.data_dragon.versions_for_region('euw1')
    champions_version = versions['n']['champion']
    current_champ_list = lol_watcher.data_dragon.champions(champions_version)
    if request.is_ajax() or request.user.is_superuser:
        return JsonResponse(current_champ_list)
    else:
        request.session['error'] = 'You dont have access to this information.'
        request.session['error1'] = 'If you thing this is wrong, contanct with an administrator'
        return redirect('/championData/')

def championsDamageData(request, pj): #EndPoint

    if 'error' in request.session:
        del request.session['error']

    if 'error1' in request.session:
        del request.session['error1']

    data = open('static/javascript/json/championDamageData/'+pj+'.json', encoding="utf8").read()
    data1 = json.loads(data)

    if request.is_ajax() or request.user.is_superuser:
        return JsonResponse(data1)
    else:
        request.session['error'] = 'You dont have access to this information.'
        request.session['error1'] = 'If you thing this is wrong, contanct with an administrator'
        return redirect('/championData/')
