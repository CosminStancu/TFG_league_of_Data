from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .forms import CrearUsuario, UpdateUser
from django.conf import settings
from riotwatcher import LolWatcher, ApiError
from django.contrib.auth.decorators import login_required
# Create your views here.
lol_watcher = LolWatcher(settings.RIOT_API)


def index(request):

    try:
        if request.method == 'POST':
            nomInvocador = request.POST.get('invocador')
            region = request.POST.get('regionId')
            nombreInvocador = lol_watcher.summoner.by_name(region, nomInvocador)
            return redirect('perfil:getInvocador', idInvocador=nombreInvocador['name'], region=region)
    except ApiError as err:
        if err.response.status_code == 403:
            return render(request, 'error.html', context={'error': 'Summoner input was empty'})
        elif err.response.status_code == 404:
            return render(request, 'error.html', context={'error': 'A summoner with that name does not exist',
                                                          'error1': 'Did you select the right server?',
                                                          'error2': ' Try searching for the summoner in another region '})
        else:
            raise

    return render(request, 'index.html')

def errorPage(request):

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
    context = {
        'error':'The page you are looking for does not exist',
        'error1':'If you thing this is wrong, contanct with an administrator'
    }
    return render(request, 'error.html', context)


def loginPage(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('login_register:index')
        else:
            messages.info(request, 'Usuario o contraseña no validos')

    context = {}
    return render(request, 'login_register/login.html', context)

def logoutPage(request):
    logout(request)
    return redirect('login_register:index')


def registerPage(request):

    form = CrearUsuario()

    if request.method == 'POST':
        form = CrearUsuario(request.POST)
        if form.is_valid():
            form.save()
            user = form.cleaned_data.get('username')
            messages.success(request, user+' ha sido creado correctamente')
            return redirect('login_register:loginPage')

    contexto = {}
    contexto['form'] = form
    return render(request, 'login_register/register.html', contexto)

@login_required
def editProfile(request):
    context = {}
    if request.method == "POST":
        form = UpdateUser(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('login_register:index')
    else:
        form = UpdateUser(instance=request.user)
        context = {'form':form}

    return render(request, 'editProfile.html', context)