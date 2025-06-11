from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def root_view(request):
       return HttpResponse('Welcome to the User Preferences API. Use /api/preferences/ or /admin/.')

urlpatterns = [
       path('', root_view, name='root'),  # Handle root URL
       path('admin/', admin.site.urls),
       path('api/', include('preferences.urls')),
       path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
       path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   ]