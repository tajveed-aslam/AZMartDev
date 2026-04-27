from sqlalchemy import Column, Integer, String
from ..database import Base


class StoreSettings(Base):
    __tablename__ = "store_settings"

    id           = Column(Integer, primary_key=True, index=True)
    store_name   = Column(String, default="A&Z Mart")
    store_tagline= Column(String, default="Premium Imported Goods")
    store_email  = Column(String, default="info@azmart.pk")
    store_phone  = Column(String, default="0300-1234567")
    store_address= Column(String, default="Local Area, Your City")
    currency     = Column(String, default="PKR")
    logo_url     = Column(String, default="")
