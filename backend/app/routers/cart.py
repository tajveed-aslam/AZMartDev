from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_current_user
from ..models import Cart, CartItem, Product
from ..models.user import User
from ..schemas.cart import CartItemAdd, CartItemUpdate, CartOut

router = APIRouter()


def _get_or_create_cart(db: Session, user_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def _cart_response(cart: Cart) -> CartOut:
    total = sum(ci.product.price * ci.quantity for ci in cart.items)
    item_count = sum(ci.quantity for ci in cart.items)
    return CartOut(
        id=cart.id,
        items=cart.items,
        total=total,
        item_count=item_count,
    )


@router.get("", response_model=CartOut)
def get_cart(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cart = _get_or_create_cart(db, user.id)
    return _cart_response(cart)


@router.post("/add", response_model=CartOut)
def add_to_cart(
    data: CartItemAdd,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    cart = _get_or_create_cart(db, user.id)
    existing = next((ci for ci in cart.items if ci.product_id == data.product_id), None)
    if existing:
        existing.quantity += data.quantity
    else:
        cart.items.append(CartItem(product_id=data.product_id, quantity=data.quantity))
    db.commit()
    db.refresh(cart)
    return _cart_response(cart)


@router.put("/{item_id}", response_model=CartOut)
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user.id)
    item = next((ci for ci in cart.items if ci.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    item.quantity = data.quantity
    db.commit()
    db.refresh(cart)
    return _cart_response(cart)


@router.delete("/{item_id}", response_model=CartOut)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user.id)
    item = next((ci for ci in cart.items if ci.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    db.refresh(cart)
    return _cart_response(cart)


@router.delete("", status_code=200)
def clear_cart(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if cart:
        db.delete(cart)
        db.commit()
    return {"message": "Cart cleared"}
