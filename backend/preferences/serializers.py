from rest_framework import serializers
from .models import Preference
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class PreferenceSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False, allow_blank=True)
    email = serializers.EmailField(source='user.email', required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=False, min_length=8)

    class Meta:
        model = Preference
        fields = [
            'username', 'email', 'password', 'email_notifications', 'push_notifications',
            'notification_frequency', 'primary_color', 'dark_mode', 'font_style',
            'visibility', 'two_factor_auth', 'data_sharing'
        ]

    def validate_password(self, value):
        # Enforce additional password requirements
        if value and len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if value and not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        return value

    def validate(self, data):
        user_data = data.get('user', {})
        if not user_data.get('username') and not self.instance:
            raise serializers.ValidationError("Username is required for new preferences.")
        return data

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_updated = False

        if user_data.get('username'):
            instance.user.username = user_data['username']
            user_updated = True
        if user_data.get('email'):
            instance.user.email = user_data['email']
            user_updated = True
        if validated_data.get('password'):
            instance.user.set_password(validated_data['password'])
            user_updated = True

        if user_updated:
            try:
                instance.user.save()
            except ValidationError as e:
                raise serializers.ValidationError({"detail": str(e)})

        instance = super().update(instance, validated_data)
        print('Updated preference instance:', instance.__dict__)  # Debug log
        return instance