from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Preference
from .serializers import PreferenceSerializer
from rest_framework.permissions import IsAuthenticated

class PreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preference, created = Preference.objects.get_or_create(user=request.user)
        serializer = PreferenceSerializer(preference)
        print('Preferences GET response:', serializer.data)  # Debug log
        return Response(serializer.data)

    def post(self, request):
        preference, created = Preference.objects.get_or_create(user=request.user)
        serializer = PreferenceSerializer(preference, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        preference, created = Preference.objects.get_or_create(user=request.user)
        serializer = PreferenceSerializer(preference, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print('Preferences PUT response:', serializer.data)  # Debug log
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)