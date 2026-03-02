from django.db import models
from django.conf import settings
from products.models import Product


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('shipped',   'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    # --- Shipping / Billing Address ---
    first_name  = models.CharField(max_length=100, blank=True, default='')
    last_name   = models.CharField(max_length=100, blank=True, default='')
    company     = models.CharField(max_length=200, blank=True, default='')
    country     = models.CharField(max_length=100, blank=True, default='')
    street      = models.CharField(max_length=255, blank=True, default='')
    city        = models.CharField(max_length=100, blank=True, default='')
    postcode    = models.CharField(max_length=20,  blank=True, default='')
    phone       = models.CharField(max_length=30,  blank=True, default='')
    email       = models.EmailField(blank=True, default='')
    order_notes = models.TextField(blank=True, default='')
    payment_method = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"


class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price    = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def product_name(self):
        return self.product.name if self.product else ''

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
