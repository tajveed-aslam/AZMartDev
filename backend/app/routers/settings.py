from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_admin_user
from ..models.settings import StoreSettings
from ..models.user import User
from ..schemas.settings import StoreSettingsOut, StoreSettingsUpdate

router = APIRouter()


def get_or_create_settings(db: Session) -> StoreSettings:
    row = db.query(StoreSettings).first()
    if not row:
        row = StoreSettings()
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("", response_model=StoreSettingsOut)
def read_settings(db: Session = Depends(get_db)):
    return get_or_create_settings(db)


@router.put("", response_model=StoreSettingsOut)
def update_settings(
    data: StoreSettingsUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    row = get_or_create_settings(db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row
