from django.urls import path
from . import views

app_name = 'perfil'

urlpatterns = [
    path('', views.getIncovador, name='getInvocador'),
    path('partida', views.getGameByPlayer, name='listaPartidas')
]

