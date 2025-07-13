from django.urls import path
from . import views

urlpatterns = [
    path('mosque/register/', views.register_mosque),
    path('mosque/mosque-login/', views.mosque_admin_login),
    path('mosque/update-azan/', views.update_azan_timings),
    path('mosque/update-namaz/', views.update_namaz_timings),
    path('mosque/<str:mosque_id>/timings/', views.get_timings_for_user),
    path('user/subscribe/', views.subscribe_user_to_mosque),
]
