import os
import django
import urllib.request
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Artifex.settings')
django.setup()

from products.models import Product, Category

categories_map = {
    "Jackets": Category.objects.get_or_create(name="Jackets")[0],
    "Dresses": Category.objects.get_or_create(name="Dresses")[0],
    "Jeans": Category.objects.get_or_create(name="Jeans")[0],
    "Shirts": Category.objects.get_or_create(name="Shirts")[0],
    "Footwear": Category.objects.get_or_create(name="Footwear")[0],
    "Accessories": Category.objects.get_or_create(name="Accessories")[0],
    "Jumpers": Category.objects.get_or_create(name="Jumpers")[0],
    "Shorts": Category.objects.get_or_create(name="Shorts")[0],
}

products_data = [
    {
        "name": "Men's Leather Bomber Jacket",
        "description": "Classic and durable leather bomber jacket for men. Perfect for a sharp vintage look.",
        "price": 199.99,
        "stock": 15,
        "category": categories_map["Jackets"],
        "url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=480&h=600&fit=crop",
        "filename": "leather_bomber.jpg"
    },
    {
        "name": "Women's Summer Midi Dress",
        "description": "Lightweight and flowy summer midi dress with a beautiful pattern.",
        "price": 59.99,
        "stock": 40,
        "category": categories_map["Dresses"],
        "url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=480&h=600&fit=crop",
        "filename": "summer_midi_dress.jpg"
    },
    {
        "name": "Distressed Denim Jeans",
        "description": "Stylish distressed blue denim jeans offering a comfortable, relaxed fit.",
        "price": 69.99,
        "stock": 50,
        "category": categories_map["Jeans"],
        "url": "https://images.unsplash.com/photo-1542272604492-5edd935ae8b9?w=480&h=600&fit=crop",
        "filename": "distressed_jeans.jpg"
    },
    {
        "name": "Casual Plaid Flannel",
        "description": "Soft and warm casual plaid flannel shirt for everyday wear.",
        "price": 39.99,
        "stock": 65,
        "category": categories_map["Shirts"],
        "url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=480&h=600&fit=crop",
        "filename": "plaid_flannel.jpg"
    },
    {
        "name": "High-Top Canvas Sneakers",
        "description": "Classic high-top canvas sneakers, providing comfort and timeless street style.",
        "price": 54.99,
        "stock": 100,
        "category": categories_map["Footwear"],
        "url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=480&h=600&fit=crop",
        "filename": "canvas_sneakers.jpg"
    },
    {
        "name": "Woven Straw Handbag",
        "description": "Elegant woven straw handbag, perfect for the beach or a stylish summer outing.",
        "price": 45.00,
        "stock": 25,
        "category": categories_map["Accessories"],
        "url": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=480&h=600&fit=crop",
        "filename": "straw_handbag.jpg"
    },
    {
        "name": "Minimalist Silver Watch",
        "description": "A sleek minimalist silver wristwatch with a comfortable leather strap.",
        "price": 120.00,
        "stock": 30,
        "category": categories_map["Accessories"],
        "url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=480&h=600&fit=crop",
        "filename": "silver_watch.jpg"
    },
    {
        "name": "Oversized Knit Sweater",
        "description": "Cozy oversized knit sweater, keeping you warm during the colder months.",
        "price": 79.99,
        "stock": 45,
        "category": categories_map["Jumpers"],
        "url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=480&h=600&fit=crop",
        "filename": "oversized_sweater.jpg"
    },
    {
        "name": "Athletic Running Shorts",
        "description": "Breathable and lightweight running shorts equipped with moisture-wicking fabric.",
        "price": 24.99,
        "stock": 80,
        "category": categories_map["Shorts"],
        "url": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=480&h=600&fit=crop",
        "filename": "running_shorts.jpg"
    },
    {
        "name": "Retro Aviator Sunglasses",
        "description": "High-quality retro aviator sunglasses with UV400 protection.",
        "price": 29.99,
        "stock": 60,
        "category": categories_map["Accessories"],
        "url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=480&h=600&fit=crop",
        "filename": "aviator_sunglasses.jpg"
    }
]

added = 0
for p_data in products_data:
    product, created = Product.objects.get_or_create(
        name=p_data['name'],
        defaults={
            'description': p_data['description'],
            'price': p_data['price'],
            'stock': p_data['stock'],
            'category': p_data['category'],
            'is_active': True
        }
    )
    if not product.image:
        req = urllib.request.Request(p_data['url'], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            image_content = response.read()
            product.image.save(p_data['filename'], ContentFile(image_content), save=True)
            print(f"Downloaded and saved image for {product.name}")
    else:
        print(f"Product {product.name} already has an image.")
    added += 1

print(f"Successfully processed {added} products.")
