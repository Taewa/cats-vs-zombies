from django.contrib import admin
from .models import Cat, Zombie

class FighterAdmin(admin.ModelAdmin):
    actions_selection_counter = True
    list_display = ['name', 'icon', 'life']

# Register your models here.
admin.site.register(Cat, FighterAdmin)
admin.site.register(Zombie, FighterAdmin)