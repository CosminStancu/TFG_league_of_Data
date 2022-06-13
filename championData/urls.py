from django.urls import path
from . import views

app_name = 'championData'

urlpatterns = [
    path('', views.buildMaker,name='championData'),
    path('campeones', views.champions, name='championList'),
    path('campeonesDanio/<str:pj>', views.championsDamageData, name='championsDamageData')
]
