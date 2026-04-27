from pydantic import BaseModel, Field, ConfigDict
from .product import ProductOut


class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity: int
    product: ProductOut


class CartOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    items: list[CartItemOut]
    total: float = 0.0
    item_count: int = 0
