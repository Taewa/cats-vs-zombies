from django.conf.urls import url, include
from rest_framework import routers
from gwapit.quickstart import views

router = routers.DefaultRouter()
router.register(r'cat', views.CatViewSet)
router.register(r'zombie', views.ZombieViewSet)

urlpatterns = [
    url(r'', include(router.urls)),
]

