from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from .category import CategoryOut


class ProductCreate(BaseModel):
    name: str = Field(min_length=2)
    description: str | None = None
    price: float = Field(gt=0)
    original_price: float | None = None
    stock: int = Field(ge=0, default=0)
    rating: float = Field(ge=0, le=5, default=0.0)
    review_count: int = Field(ge=0, default=0)
    images: list[str] = []
    is_featured: bool = False
    category_id: int


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    original_price: float | None = None
    stock: int | None = None
    rating: float | None = None
    review_count: int | None = None
    images: list[str] | None = None
    is_featured: bool | None = None
    is_active: bool | None = None
    category_id: int | None = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    price: float
    original_price: float | None
    stock: int
    rating: float
    review_count: int
    images: list[str]
    is_featured: bool
    is_active: bool
    category_id: int
    category: CategoryOut
    created_at: datetime


class ProductListOut(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    pages: int
