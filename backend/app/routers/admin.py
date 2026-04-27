from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..dependencies import get_db, get_admin_user
from ..models import Order, Product, User as UserModel
from ..models.order import OrderStatus
from ..schemas.order import AdminOrderOut
from ..schemas.user import UserOut

router = APIRouter()


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    total_orders = db.query(Order).count()
    total_users = db.query(UserModel).filter(UserModel.role == "customer").count()
    total_products = db.query(Product).filter(Product.is_active == True).count()
    recent_orders = (
        db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    )
    recent = []
    for o in recent_orders:
        user = db.query(UserModel).filter(UserModel.id == o.user_id).first()
        d = AdminOrderOut.model_validate(o)
        d.user_email = user.email if user else None
        d.user_name = user.full_name if user else None
        recent.append(d)

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_products": total_products,
        "recent_orders": recent,
    }


@router.get("/orders", response_model=dict)
def admin_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    status: str | None = None,
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    q = db.query(Order)
    if status:
        q = q.filter(Order.status == status)
    q = q.order_by(Order.created_at.desc())
    total = q.count()
    orders = q.offset((page - 1) * page_size).limit(page_size).all()
    items = []
    for o in orders:
        user = db.query(UserModel).filter(UserModel.id == o.user_id).first()
        d = AdminOrderOut.model_validate(o)
        d.user_email = user.email if user else None
        d.user_name = user.full_name if user else None
        items.append(d)
    return {"items": items, "total": total, "page": page, "pages": max(1, -(-total // page_size))}


@router.patch("/orders/{order_id}", response_model=AdminOrderOut)
def update_order_status(
    order_id: int,
    body: dict,
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    new_status = body.get("status")
    if new_status not in [s.value for s in OrderStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
    order.status = new_status
    db.commit()
    db.refresh(order)
    user = db.query(UserModel).filter(UserModel.id == order.user_id).first()
    d = AdminOrderOut.model_validate(order)
    d.user_email = user.email if user else None
    d.user_name = user.full_name if user else None
    return d


@router.get("/users", response_model=list[UserOut])
def admin_users(db: Session = Depends(get_db), _=Depends(get_admin_user)):
    return db.query(UserModel).order_by(UserModel.created_at.desc()).all()
