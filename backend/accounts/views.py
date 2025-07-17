from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

class RegisterView(APIView):
    # Allow unauthenticated users to access this view
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Validate required fields
        if not username or not password:
            return Response({"detail": "Username and password required"}, status=400)

        # Check if username is already taken
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already taken"}, status=400)

        # Create new user
        User.objects.create_user(username=username, password=password)
        return Response({"detail": "User created"}, status=201)
