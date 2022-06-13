from django.shortcuts import  redirect

def handle_404_err(request,exception):
    return redirect('login_register:errorPage')
