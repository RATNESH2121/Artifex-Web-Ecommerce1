from django.urls import path
from . import views

urlpatterns = [
    path('',                 views.order_list,          name='order_list'),       # GET all (admin) / own (user), POST place order
    path('mine/',            views.my_orders,           name='my_orders'),        # GET always returns own orders only (for Profile page)
    path('<int:pk>/',        views.order_detail,        name='order_detail'),     # GET / DELETE single order
    path('<int:pk>/status/', views.update_order_status, name='order_status'),     # PUT update status (admin)
]
