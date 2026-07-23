import pytest
from fastapi import HTTPException

from app.models import Cart, CartItem, Category, Product, User
from app.models.user import Role
from app.schemas.order import OrderCreate
from app.services.auth_service import hash_password
from app.services.order_service import create_order_from_cart


def _make_user(db_session):
    user = User(email="buyer@example.com", full_name="Buyer", hashed_password=hash_password("x"), role=Role.customer)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _make_product(db_session, price=1000.0, stock=5):
    category = Category(name="Perfumes", slug="perfumes")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    product = Product(name="Test Perfume", price=price, stock=stock, category_id=category.id)
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    return product


def _cart_with_item(db_session, user, product, quantity):
    cart = Cart(user_id=user.id)
    db_session.add(cart)
    db_session.commit()
    db_session.refresh(cart)
    db_session.add(CartItem(cart_id=cart.id, product_id=product.id, quantity=quantity))
    db_session.commit()
    return cart


def _order_data():
    return OrderCreate(full_name="Buyer", phone="0300-1234567", address="123 Main St", city="Karachi")


def test_create_order_computes_total_from_server_side_price(db_session):
    # The regression this guards: an order total must come from the
    # product's own price in the DB, never anything the client could send —
    # otherwise checkout is trivially exploitable.
    user = _make_user(db_session)
    product = _make_product(db_session, price=2500.0, stock=10)
    _cart_with_item(db_session, user, product, quantity=3)

    order = create_order_from_cart(db_session, user.id, _order_data())

    assert order.total_amount == 7500.0
    assert order.items[0].unit_price == 2500.0


def test_create_order_decrements_stock(db_session):
    user = _make_user(db_session)
    product = _make_product(db_session, price=1000.0, stock=5)
    _cart_with_item(db_session, user, product, quantity=2)

    create_order_from_cart(db_session, user.id, _order_data())

    db_session.refresh(product)
    assert product.stock == 3


def test_create_order_rejects_insufficient_stock(db_session):
    user = _make_user(db_session)
    product = _make_product(db_session, price=1000.0, stock=1)
    _cart_with_item(db_session, user, product, quantity=5)

    with pytest.raises(HTTPException) as exc_info:
        create_order_from_cart(db_session, user.id, _order_data())
    assert exc_info.value.status_code == 400


def test_create_order_rejects_empty_cart(db_session):
    user = _make_user(db_session)
    cart = Cart(user_id=user.id)
    db_session.add(cart)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        create_order_from_cart(db_session, user.id, _order_data())
    assert exc_info.value.status_code == 400


def test_create_order_rejects_missing_cart(db_session):
    user = _make_user(db_session)

    with pytest.raises(HTTPException) as exc_info:
        create_order_from_cart(db_session, user.id, _order_data())
    assert exc_info.value.status_code == 400
