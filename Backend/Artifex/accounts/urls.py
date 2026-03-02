from django.urls import path
from . import views

urlpatterns = [
    path('register/',        views.register,            name='register'),
    path('login/',           views.login_view,          name='login'),
    path('logout/',          views.logout_view,         name='logout'),
    path('profile/',         views.profile,             name='profile'),
    path('profile/update/',  views.update_profile,      name='profile_update'),
    path('users/',           views.all_users,           name='all_users'),
]
