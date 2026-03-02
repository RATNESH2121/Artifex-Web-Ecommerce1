"""
URL configuration for Artifex project.

API Routes:
  /admin/              → Django admin panel
  /api/auth/           → accounts app (register, login, profile)
  /api/products/       → products app (list, detail, CRUD)
  /api/orders/         → orders app (place order, list, status update)
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/',         admin.site.urls),
    path('api/auth/',      include('accounts.urls')),
    path('api/products/',  include('products.urls')),
    path('api/orders/',    include('orders.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  
