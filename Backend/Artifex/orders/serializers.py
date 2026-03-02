from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model  = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items    = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'username', 'status', 'total_price', 'created_at', 'items',
            # Address fields
            'first_name', 'last_name', 'company', 'country',
            'street', 'city', 'postcode', 'phone', 'email',
            'order_notes', 'payment_method',
        ]
