from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..models import Cart, Order, OrderItem, OrderStatus
from ..schemas.order import OrderCreate


def create_order_from_cart(db: Session, user_id: int, data: OrderCreate) -> Order:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0.0
    order_items = []
    for ci in cart.items:
        product = ci.product
        if product.stock < ci.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )
        subtotal = product.price * ci.quantity
        total += subtotal
        order_items.append(OrderItem(
            product_id=product.id,
            product_name=product.name,
            product_image=product.images[0] if product.images else None,
            quantity=ci.quantity,
            unit_price=product.price,
        ))
        product.stock -= ci.quantity

    order = Order(
        user_id=user_id,
        status=OrderStatus.pending,
        total_amount=total,
        full_name=data.full_name,
        phone=data.phone,
        address=data.address,
        city=data.city,
        notes=data.notes,
        items=order_items,
    )
    db.add(order)
    db.delete(cart)
    db.commit()
    db.refresh(order)
    return order
