from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Fighters(models.Model):
    name = models.CharField(max_length=255)
    icon = models.URLField()
    life = models.PositiveIntegerField(default=100)
    attack = models.PositiveIntegerField(default=5)
    defense = models.PositiveIntegerField(default=5)

    class Meta:
        abstract = True

class Cat(Fighters):
    pass

class Zombie(Fighters):
    pass