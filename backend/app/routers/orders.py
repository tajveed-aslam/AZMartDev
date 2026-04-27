from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_current_user
from ..models import Order
from ..models.user import User
from ..schemas.order import OrderCreate, OrderOut
from ..services.order_service import create_order_from_cart
from ..services.email_service import send_order_notification

router = APIRouter()


@router.post("", response_model=OrderOut)
def place_order(
    data: OrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = create_order_from_cart(db, user.id, data)
    background_tasks.add_task(send_order_notification, order, order.items)
    return order


@router.get("", response_model=list[OrderOut])
def my_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
