# Generated by Django 5.2.2 on 2025-06-09 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('preferences', '0002_rename_share_data_preference_data_sharing_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='preference',
            name='email',
        ),
        migrations.RemoveField(
            model_name='preference',
            name='username',
        ),
        migrations.AddField(
            model_name='preference',
            name='font_style',
            field=models.CharField(choices=[('arial', 'Arial'), ('times', 'Times New Roman'), ('verdana', 'Verdana')], default='arial', max_length=50),
        ),
        migrations.AddField(
            model_name='preference',
            name='visibility',
            field=models.BooleanField(default=True),
        ),
    ]
