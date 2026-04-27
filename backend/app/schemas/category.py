from pydantic import BaseModel, ConfigDict


class CategoryCreate(BaseModel):
    name: str
    slug: str
    icon: str = "📦"


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    icon: str | None = None
    is_active: bool | None = None


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    icon: str
    is_active: bool
    product_count: int = 0
