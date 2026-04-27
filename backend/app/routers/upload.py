import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from ..dependencies import get_admin_user
from ..models.user import User

router = APIRouter()

UPLOAD_DIR = Path("static/uploads")
ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    _: User = Depends(get_admin_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP allowed")
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    (UPLOAD_DIR / filename).write_bytes(content)
    return {"url": f"/static/uploads/{filename}"}
