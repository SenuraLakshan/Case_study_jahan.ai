from django.db import models
from django.contrib.auth.models import  User

class Preference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preference')
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=False)
    notification_frequency = models.CharField(max_length=50, choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')], default='daily')
    primary_color = models.CharField(max_length=7, default='#1e90ff')
    dark_mode = models.BooleanField(default=False)
    font_style = models.CharField(max_length=50, choices=[('arial', 'Arial'), ('times', 'Times New Roman'), ('verdana', 'Verdana')], default='arial')
    visibility = models.BooleanField(default=True)
    two_factor_auth = models.BooleanField(default=False)
    data_sharing = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s Preferences"