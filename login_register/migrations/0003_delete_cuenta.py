# Generated by Django 3.2.9 on 2022-06-13 03:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login_register', '0002_alter_cuenta_summonerid'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Cuenta',
        ),
    ]