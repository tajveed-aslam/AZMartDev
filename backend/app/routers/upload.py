import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from ..dependencies import get_admin_user
from ..models.user import User

router = APIRouter()

UPLOAD_DIR = Path("static/uploads")
MAX_SIZE = 5 * 1024 * 1024

# Content-type header is client-controlled and spoofable, so the saved
# file's extension is derived from this fixed mapping, not from the
# client-supplied filename — the original filename is discarded entirely.
ALLOWED_TYPES = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    _: User = Depends(get_admin_user),
):
    ext = ALLOWED_TYPES.get(file.content_type)
    if not ext:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP allowed")
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.{ext}"
    (UPLOAD_DIR / filename).write_bytes(content)
    return {"url": f"/static/uploads/{filename}"}
