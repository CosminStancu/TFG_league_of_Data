from django.urls import path
from . import views

app_name = 'login_register'

urlpatterns = [
    path('', views.index, name='index'),
    path('error', views.errorPage, name='errorPage'),
    path('login/', views.loginPage, name='loginPage'),
    path('register/', views.registerPage, name='registerPage'),
    path('logout/', views.logoutPage, name='cerrarSesion'),
    path('editProfile/', views.editProfile, name='editProfile')
]
