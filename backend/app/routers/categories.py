from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_admin_user
from ..models import Category, Product
from ..models.user import User
from ..schemas.category import CategoryCreate, CategoryUpdate, CategoryOut

router = APIRouter()


def _enrich(cat: Category, db: Session) -> CategoryOut:
    count = db.query(Product).filter(
        Product.category_id == cat.id, Product.is_active == True
    ).count()
    out = CategoryOut.model_validate(cat)
    out.product_count = count
    return out


@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).filter(Category.is_active == True).all()
    return [_enrich(c, db) for c in cats]


@router.post("", response_model=CategoryOut)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    if db.query(Category).filter(Category.slug == data.slug).first():
        raise HTTPException(status_code=400, detail="Slug already exists")
    cat = Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return _enrich(cat, db)


@router.put("/{cat_id}", response_model=CategoryOut)
def update_category(
    cat_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return _enrich(cat, db)


@router.delete("/{cat_id}")
def delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    active_products = db.query(Product).filter(
        Product.category_id == cat_id, Product.is_active == True
    ).count()
    if active_products > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete: {active_products} active product(s) in this category"
        )
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}
