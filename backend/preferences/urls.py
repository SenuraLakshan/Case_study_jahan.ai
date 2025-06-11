from django.urls import path
from .views import PreferenceView

urlpatterns = [
    path('preferences/', PreferenceView.as_view(), name='preferences'),
]