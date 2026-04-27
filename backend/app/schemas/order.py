from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class OrderCreate(BaseModel):
    full_name: str
    phone: str
    address: str
    city: str
    notes: str | None = None


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    product_name: str
    product_image: str | None
    quantity: int
    unit_price: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    total_amount: float
    full_name: str
    phone: str
    address: str
    city: str
    notes: str | None
    created_at: datetime
    items: list[OrderItemOut]


class AdminOrderOut(OrderOut):
    user_id: int | None
    user_email: str | None = None
    user_name: str | None = None
