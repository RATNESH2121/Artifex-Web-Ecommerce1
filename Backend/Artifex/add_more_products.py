import os
import shutil
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Artifex.settings')
django.setup()

from products.models import Product, Category
from django.core.files import File

# Create or get categories
categories_map = {
    "Dresses": Category.objects.get_or_create(name="Dresses")[0],
    "Footwear": Category.objects.get_or_create(name="Footwear")[0],
    "Jackets": Category.objects.get_or_create(name="Jackets")[0],
    "Shirts": Category.objects.get_or_create(name="Shirts")[0],
    "Shorts": Category.objects.get_or_create(name="Shorts")[0]
}

products_data = [
    {
        "name": "Elegant Red Cocktail Dress",
        "description": "A stunning and elegant red cocktail dress, perfect for evening parties and special occasions.",
        "price": 89.99,
        "stock": 20,
        "category": categories_map["Dresses"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\red_dress_1772050530015.png",
        "image_name": "red_dress.png"
    },
    {
        "name": "Black Leather Oxford Shoes",
        "description": "Classic and polished black leather formal oxford shoes for men. Ideal for business and formal wear.",
        "price": 129.99,
        "stock": 35,
        "category": categories_map["Footwear"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\black_shoes_1772050617724.png",
        "image_name": "black_shoes.png"
    },
    {
        "name": "Classic Beige Trench Coat",
        "description": "A timeless beige trench coat for women, offering style and protection during transitional weather.",
        "price": 149.99,
        "stock": 15,
        "category": categories_map["Jackets"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\trench_coat_1772050709654.png",
        "image_name": "trench_coat.png"
    },
    {
        "name": "White Button-Down Shirt",
        "description": "Essential crisp white button-down dress shirt for men. versatile for both office and casual settings.",
        "price": 45.99,
        "stock": 60,
        "category": categories_map["Shirts"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\white_button_down_1772051011443.png",
        "image_name": "white_button_down.png"
    },
    {
        "name": "Casual Khaki Shorts",
        "description": "Comfortable and casual khaki shorts for men, perfect for summer outings and relaxed weekends.",
        "price": 29.99,
        "stock": 50,
        "category": categories_map["Shorts"],
        "image_source": r"C:\Users\asus\.gemini\antigravity\brain\5988fd15-019f-46fd-919c-1953f6a5288f\khaki_shorts_1772051134503.png",
        "image_name": "khaki_shorts.png"
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

print("Added 5 products successfully.")
