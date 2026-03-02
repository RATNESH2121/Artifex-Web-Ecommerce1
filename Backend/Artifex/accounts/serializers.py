from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone', 'address']
        extra_kwargs = {
            'password': {'write_only': True}  
        }

    def create(self, validated_data):
        
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Used to return user profile info"""
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'address', 'date_joined']
