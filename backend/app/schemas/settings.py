from pydantic import BaseModel


class StoreSettingsOut(BaseModel):
    id:            int
    store_name:    str
    store_tagline: str
    store_email:   str
    store_phone:   str
    store_address: str
    currency:      str
    logo_url:      str

    model_config = {"from_attributes": True}


class StoreSettingsUpdate(BaseModel):
    store_name:    str | None = None
    store_tagline: str | None = None
    store_email:   str | None = None
    store_phone:   str | None = None
    store_address: str | None = None
    currency:      str | None = None
    logo_url:      str | None = None
