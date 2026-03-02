from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

    class Meta:
        model  = Product
        fields = ['id', 'name', 'description', 'price', 'stock',
                  'image', 'is_active', 'category', 'category_name', 'created_at']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else "General"
