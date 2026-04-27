from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..dependencies import get_db
from ..models.product import Product
from ..models.category import Category
from ..schemas.product import ProductOut

router = APIRouter()

GREETINGS = {"hi", "hello", "hey", "salam", "assalam", "howdy"}
BUDGET_KEYWORDS = ["cheap", "budget", "affordable", "under", "less than", "below"]
GIFT_KEYWORDS = ["gift", "present", "birthday", "surprise", "someone special"]
POPULAR_KEYWORDS = ["popular", "best", "top", "recommend", "trending", "featured"]


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    products: list[ProductOut]


def _extract_max_price(text: str) -> float | None:
    import re
    match = re.search(r"(?:under|below|less than|max|upto?)\s*(?:pkr|rs\.?)?\s*([0-9,]+)", text, re.IGNORECASE)
    if match:
        return float(match.group(1).replace(",", ""))
    match = re.search(r"([0-9,]+)\s*(?:pkr|rs\.?)", text, re.IGNORECASE)
    if match:
        return float(match.group(1).replace(",", ""))
    return None


def _search_products(db: Session, query: str, max_price: float | None = None, limit: int = 3) -> list[Product]:
    words = [w for w in query.lower().split() if len(w) > 2]
    stop = {"the", "and", "for", "with", "our", "you", "any", "can", "want", "need", "have", "best", "good"}
    keywords = [w for w in words if w not in stop]

    q = db.query(Product).join(Category).filter(Product.is_active.is_(True))
    if max_price:
        q = q.filter(Product.price <= max_price)

    results: list[Product] = []
    for kw in keywords[:3]:
        found = q.filter(
            Product.name.ilike(f"%{kw}%") |
            Product.description.ilike(f"%{kw}%") |
            Category.name.ilike(f"%{kw}%") |
            Category.slug.ilike(f"%{kw}%")
        ).limit(limit).all()
        for p in found:
            if p not in results:
                results.append(p)
        if len(results) >= limit:
            break

    if not results:
        results = q.filter(Product.is_featured.is_(True)).limit(limit).all()

    return results[:limit]


def _build_reply(message: str, products: list[Product]) -> str:
    msg = message.lower().strip()

    if not message.strip():
        return "Hi! Ask me anything about our products — I can help you find the perfect item."

    if any(w in msg for w in GREETINGS):
        return "Hello! Welcome to A&Z Mart. How can I help you today? Ask me about perfumes, shoes, electronics, jewellery or toys!"

    if not products:
        return "Sorry, I couldn't find products matching your query. Try searching by category: perfumes, shoes, electronics, jewellery, or toys."

    names = ", ".join(f"**{p.name}**" for p in products)

    if any(w in msg for w in GIFT_KEYWORDS):
        return f"Great gift ideas for you: {names}. All are genuine imports — perfect for someone special!"

    if any(w in msg for w in BUDGET_KEYWORDS):
        return f"Here are some budget-friendly picks: {names}. Great value for money!"

    if any(w in msg for w in POPULAR_KEYWORDS):
        return f"Our top picks right now: {names}. Customers love these!"

    return f"I found some matching products for you: {names}. Tap any to see details!"


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    max_price = _extract_max_price(req.message)
    products = _search_products(db, req.message, max_price=max_price)
    reply = _build_reply(req.message, products)
    return ChatResponse(reply=reply, products=products)
