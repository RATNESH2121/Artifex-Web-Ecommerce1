from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def product_list(request):

    if request.method == 'GET':
        is_admin = (
            request.user.is_authenticated and (
                getattr(request.user, 'role', '') == 'admin'
                or request.user.is_staff
                or request.user.is_superuser
            )
        )
        if is_admin:
            # Admin sees EVERYTHING — active, inactive, superuser-created
            products = Product.objects.all().order_by('-id')
        else:
            # Regular users / anonymous — only active products
            products = Product.objects.filter(is_active=True).order_by('-id')

        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    if request.method == 'POST':
        is_admin = (
            request.user.is_authenticated and (
                getattr(request.user, 'role', '') == 'admin'
                or request.user.is_staff
                or request.user.is_superuser
            )
        )
        if not is_admin:
            return Response({'error': 'Admin access only!'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        cat_name = data.get('category_name')
        if cat_name:
            cat, _ = Category.objects.get_or_create(name=cat_name)
            data['category'] = cat.id

        # Always mark admin-created products as active
        data['is_active'] = True

        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)

    is_admin = (
        request.user.is_authenticated and (
            getattr(request.user, 'role', '') == 'admin'
            or request.user.is_staff
            or request.user.is_superuser
        )
    )

    if request.method == 'DELETE':
        if not is_admin:
            return Response({'error': 'Admin access only!'}, status=status.HTTP_403_FORBIDDEN)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    if request.method == 'PUT':
        if not is_admin:
            return Response({'error': 'Admin access only!'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        cat_name = data.get('category_name')
        if cat_name:
            cat, _ = Category.objects.get_or_create(name=cat_name)
            data['category'] = cat.id
        serializer = ProductSerializer(product, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
