from django.core.exceptions import ValidationError
from django.forms import ModelForm
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.forms import User



class CrearUsuario(UserCreationForm):
    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise ValidationError("emailError")
        return email
    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            raise ValidationError("userError")
        return username
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={'class': 'form-control form-rounded', 'type': 'password', 'placeholder': 'Password'}),
    )
    password2 = forms.CharField(
        label="Confirm password",
        widget=forms.PasswordInput(attrs={'class': 'form-control form-rounded', 'type': 'password', 'placeholder': 'Repeat the password'}),
    )
    class Meta:
        model = User
        fields = ['email', 'username']
        widgets = {
            'email': forms.EmailInput(attrs={'class': 'form-control form-rounded',
                                             'placeholder': 'Email',
                                             'autocomplete': 'off'}),
            'username': forms.TextInput(attrs={'class': 'form-control form-rounded',
                                               'placeholder': 'User',
                                               'autocomplete': 'off'})
        }

class UpdateUser(UserChangeForm):

    class Meta:
        model = User
        fields = (
            'summonerId',
            'selectRegion'
        )
        widgets = {
            'summonerId': forms.TextInput(attrs={'class': 'form-control form-rounded',
                                                   'placeholder': 'Summoner Id',
                                                   'autocomplete': 'off'
            }),
            'selectRegion': forms.Select(attrs={'class': 'form-control form-rounded myDisabledInput',
                                            'autocomplete': 'off',
                                            }),
        }