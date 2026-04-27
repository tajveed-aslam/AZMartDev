import uuid
import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..dependencies import get_db, get_admin_user
from ..models import Product, Category
from ..models.user import User
from ..schemas.product import ProductCreate, ProductUpdate, ProductOut, ProductListOut

router = APIRouter()

UPLOAD_DIR = Path("static/uploads")
ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB


@router.get("", response_model=ProductListOut)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=48),
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    search: str | None = None,
    sort: str = "newest",
    featured: bool | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Product).filter(Product.is_active == True)
    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            q = q.filter(Product.category_id == cat.id)
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)
    if search:
        q = q.filter(or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
        ))
    if featured is not None:
        q = q.filter(Product.is_featured == featured)

    sort_map = {
        "newest": Product.created_at.desc(),
        "price_asc": Product.price.asc(),
        "price_desc": Product.price.desc(),
        "rating": Product.rating.desc(),
    }
    q = q.order_by(sort_map.get(sort, Product.created_at.desc()))

    total = q.count()
    items = q.offset((page - 1) * page_size).limit(page_size).all()
    return ProductListOut(
        items=items,
        total=total,
        page=page,
        pages=max(1, -(-total // page_size)),
    )


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p


@router.post("", response_model=ProductOut)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    if not db.query(Category).filter(Category.id == data.category_id).first():
        raise HTTPException(status_code=400, detail="Category not found")
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(p, field, value)
    db.commit()
    db.refresh(p)
    return p


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.is_active = False
    db.commit()
    return {"message": "Product deactivated"}


@router.post("/{product_id}/images")
async def upload_product_images(
    product_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images allowed")

    urls = list(p.images or [])
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    for file in files:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}")
        content = await file.read()
        if len(content) > MAX_SIZE:
            raise HTTPException(status_code=400, detail="File too large (max 5MB)")
        ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "jpg"
        filename = f"{uuid.uuid4().hex}.{ext}"
        path = UPLOAD_DIR / filename
        path.write_bytes(content)
        urls.append(f"/static/uploads/{filename}")

    p.images = urls
    db.commit()
    return {"images": p.images}
