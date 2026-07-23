from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings as app_settings
from .database import engine, Base
from .models import *  # noqa: F401 — ensure all models are registered
from .routers import auth, categories, products, upload, cart, orders, admin, settings, chat

# create tables
Base.metadata.create_all(bind=engine)

# ensure uploads dir exists
Path("static/uploads").mkdir(parents=True, exist_ok=True)

app = FastAPI(title="A&Z Mart API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# serve uploaded images
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router,       prefix="/auth",       tags=["auth"])
app.include_router(categories.router, prefix="/categories", tags=["categories"])
app.include_router(products.router,   prefix="/products",   tags=["products"])
app.include_router(upload.router,     prefix="/upload",     tags=["upload"])
app.include_router(cart.router,       prefix="/cart",       tags=["cart"])
app.include_router(orders.router,     prefix="/orders",     tags=["orders"])
app.include_router(admin.router,      prefix="/admin",      tags=["admin"])
app.include_router(settings.router,   prefix="/settings",   tags=["settings"])
app.include_router(chat.router,       prefix="/chat",        tags=["chat"])


@app.get("/")
def health():
    return {"status": "ok", "app": "A&Z Mart API v1.0"}
