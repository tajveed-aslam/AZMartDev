from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    icon = Column(String, default="📦")
    is_active = Column(Boolean, default=True)

    products = relationship("Product", back_populates="category")
