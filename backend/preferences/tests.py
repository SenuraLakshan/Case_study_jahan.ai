from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Preference

class PreferenceViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.client.login(username='testuser', password='password')
        self.token = self.client.post('/api/token/', {'username': 'testuser', 'password': 'password'}).data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_get_preferences(self):
        response = self.client.get('/api/preferences/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_put_preferences(self):
        data = {'username': 'newuser', 'email': 'new@example.com'}
        response = self.client.put('/api/preferences/', data)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newuser')
        self.assertEqual(self.user.email, 'new@example.com')