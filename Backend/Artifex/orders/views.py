from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product


def is_admin_user(user):
    return (
        user.is_authenticated and (
            getattr(user, 'role', '') == 'admin'
            or user.is_staff
            or user.is_superuser
        )
    )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def order_list(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Login required'}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        if is_admin_user(request.user):
            orders = Order.objects.all().order_by('-created_at')
        else:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        data = request.data if isinstance(request.data, dict) else {}

        items_data = data.get('items', [])
        if isinstance(items_data, str):
            import json
            try:
                items_data = json.loads(items_data)
            except json.JSONDecodeError:
                items_data = []

        if not items_data:
            return Response({'error': 'No items in order!'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Extract shipping address from payload ---
        address = data.get('address', {})

        order = Order.objects.create(
            user=request.user,
            # Address fields
            first_name     = address.get('first_name', ''),
            last_name      = address.get('last_name', ''),
            company        = address.get('company', ''),
            country        = address.get('country', ''),
            street         = address.get('street', ''),
            city           = address.get('city', ''),
            postcode       = address.get('postcode', ''),
            phone          = address.get('phone', ''),
            email          = address.get('email', ''),
            order_notes    = address.get('order_notes', ''),
            payment_method = address.get('payment_method', ''),
        )

        total_price = 0
        for item in items_data:
            product_id = item.get('product_id')
            quantity = int(item.get('quantity', 1))

            try:
                product = Product.objects.get(id=product_id)
                price = float(product.price)
                product.stock = max(0, product.stock - quantity)
                product.save()
            except Product.DoesNotExist:
                name = item.get('name', f'Product #{product_id}')
                price = float(item.get('price', 0))
                if price <= 0:
                    continue
                product, _ = Product.objects.get_or_create(
                    id=product_id,
                    defaults={
                        'name': name,
                        'price': price,
                        'stock': 0,
                        'is_active': False,
                        'description': 'Static product (from cart)',
                    }
                )

            OrderItem.objects.create(
                order=order, product=product, quantity=quantity, price=price,
            )
            total_price += price * quantity

        order.total_price = total_price
        order.save()

        serializer = OrderSerializer(order)
        return Response(
            {'message': 'Order placed!', 'order': serializer.data},
            status=status.HTTP_201_CREATED
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def my_orders(request):
    """Always returns only the logged-in user's own orders — for the Profile page."""
    if not request.user.is_authenticated:
        return Response({'error': 'Login required'}, status=status.HTTP_401_UNAUTHORIZED)
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def order_detail(request, pk):
    if not request.user.is_authenticated:
        return Response({'error': 'Login required'}, status=status.HTTP_401_UNAUTHORIZED)

    admin = is_admin_user(request.user)
    try:
        order = Order.objects.get(pk=pk) if admin else Order.objects.get(pk=pk, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(OrderSerializer(order).data)

    if request.method == 'DELETE':
        if not admin:
            return Response({'error': 'Admin access only!'}, status=status.HTTP_403_FORBIDDEN)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
@permission_classes([AllowAny])
def update_order_status(request, pk):
    if not request.user.is_authenticated:
        return Response({'error': 'Login required'}, status=status.HTTP_401_UNAUTHORIZED)
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access only!'}, status=status.HTTP_403_FORBIDDEN)

    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    valid = ['pending', 'shipped', 'delivered', 'cancelled']
    if new_status not in valid:
        return Response({'error': f"Status must be one of: {valid}"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()
    return Response({'message': f"Order status updated to '{new_status}'"})
