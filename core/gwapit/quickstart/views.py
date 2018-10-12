from django.shortcuts import render
from rest_framework import viewsets
from .models import Cat, Zombie
from .serializer import CatSerializer,ZombieSerializer

# Create your views here.
class CatViewSet(viewsets.ModelViewSet):
    queryset = Cat.objects.all()
    serializer_class = CatSerializer



class ZombieViewSet(viewsets.ModelViewSet):
    queryset = Zombie.objects.all()
    serializer_class = ZombieSerializer
