from rest_framework import serializers
from .models import Cat,Zombie

class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = ('name', 'icon', 'life', 'attack', 'defense')

class ZombieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zombie
        fields = ('name', 'icon', 'life', 'attack', 'defense')