import os
import shutil
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Artifex.settings')
django.setup()

from products.models import Product, Category
from django.core.files import File

# Create or get categories
categories_map = {
    "T-Shirts": Category.objects.get_or_create(name="T-Shirts")[0],
    "Jackets": Category.objects.get_or_create(name="Jackets")[0],
    "Jeans": Category.objects.get_or_create(name="Jeans")[0],
    "Dresses": Category.objects.get_or_create(name="Dresses")[0],
    "Hoodies": Category.objects.get_or_create(name="Hoodies")[0],
    "Accessories": Category.objects.get_or_create(name="Accessories")[0],
    "Shirts": Category.objects.get_or_create(name="Shirts")[0],
    "Footwear": Category.objects.get_or_create(name="Footwear")[0],
    "Pants": Category.objects.get_or_create(name="Pants")[0],
}

products_data = [
    {
        "name": "Classic White T-Shirt",
        "description": "A high-quality classic plain white t-shirt perfectly suited for daily wear. Soft and comfortable material.",
        "price": 29.99,
        "stock": 50,
        "category": categories_map["T-Shirts"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\white_tshirt_1772049737194.png",
        "image_name": "white_tshirt.png"
    },
    {
        "name": "Black Denim Jacket",
        "description": "A stylish and durable black denim jacket, perfect for any casual outfit.",
        "price": 89.99,
        "stock": 30,
        "category": categories_map["Jackets"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\black_denim_jacket_1772049778569.png",
        "image_name": "black_denim_jacket.png"
    },
    {
        "name": "Blue Slim Fit Jeans",
        "description": "Comfortable and trendy blue slim fit jeans made with premium denim fabric.",
        "price": 59.99,
        "stock": 40,
        "category": categories_map["Jeans"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\blue_jeans_1772049904060.png",
        "image_name": "blue_jeans.png"
    },
    {
        "name": "Floral Summer Dress",
        "description": "Lightweight and beautiful floral summer dress, elegant look for warm weather.",
        "price": 49.99,
        "stock": 25,
        "category": categories_map["Dresses"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\floral_dress_1772049943188.png",
        "image_name": "floral_dress.png"
    },
    {
        "name": "Grey Pullover Hoodie",
        "description": "Stay cozy with this incredibly soft grey pullover hoodie. Perfect for relaxing or going out.",
        "price": 39.99,
        "stock": 60,
        "category": categories_map["Hoodies"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\grey_hoodie_1772050034671.png",
        "image_name": "grey_hoodie.png"
    },
    {
        "name": "Leather Crossbody Bag",
        "description": "A premium brown leather crossbody handbag with elegant stitching and durable strap.",
        "price": 119.99,
        "stock": 15,
        "category": categories_map["Accessories"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\leather_bag_1772050083531.png",
        "image_name": "leather_bag.png"
    },
    {
        "name": "Red Plaid Flannel Shirt",
        "description": "Warm and stylish red and black plaid flannel shirt, an essential item for the season.",
        "price": 34.99,
        "stock": 45,
        "category": categories_map["Shirts"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\plaid_shirt_1772050143516.png",
        "image_name": "plaid_shirt.png"
    },
    {
        "name": "White Running Sneakers",
        "description": "High-performance crisp white running sneakers with superior comfort and grip.",
        "price": 79.99,
        "stock": 50,
        "category": categories_map["Footwear"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\sneakers_1772050170144.png",
        "image_name": "sneakers.png"
    },
    {
        "name": "Navy Chino Pants",
        "description": "Versatile navy blue chino pants, great for both a casual and a semi-formal look.",
        "price": 45.99,
        "stock": 35,
        "category": categories_map["Pants"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\navy_chinos_1772050198630.png",
        "image_name": "navy_chinos.png"
    },
    {
        "name": "Knitted Winter Beanie",
        "description": "Chunky knit mustard yellow winter beanie. Keeps you warm while looking trendy.",
        "price": 19.99,
        "stock": 100,
        "category": categories_map["Accessories"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\yellow_beanie_1772050317669.png",
        "image_name": "yellow_beanie.png"
    }
]

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
    if product.image:
        continue # Already has image
    with open(p_data['image_source'], 'rb') as f:
        product.image.save(p_data['image_name'], File(f), save=True)
    print(f"Created product: {product.name}")

print("Added 10 products successfully.")
