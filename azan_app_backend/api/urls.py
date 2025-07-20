from django.urls import path
from . import views

urlpatterns = [
    path('mosque/register/', views.register_mosque),
    path('mosque/mosque-login/', views.mosque_admin_login),
    path('mosque/update-azan/', views.update_azan_timings),
    path('mosque/update-namaz/', views.update_namaz_timings),
    path('mosque/<str:mosque_id>/timings/', views.get_timings_for_user),
    path('user/subscribe/', views.subscribe_user_to_mosque),
    path('user/<str:user_id>/subscriptions/', views.get_user_subscriptions),
    path('user/<str:user_id>/preferred-mosque/', views.get_user_preferred_mosque),
    path('user/<str:user_id>/set-preference/', views.update_preferred_mosque),

]
