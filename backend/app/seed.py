# Run with: python -m app.seed  (from D:/AZMart/backend)
# Idempotent -- safe to run multiple times.
from .database import SessionLocal, engine, Base
from .models import *  # noqa
from .models.user import Role
from .models.order import OrderStatus
from .services.auth_service import hash_password

Base.metadata.create_all(bind=engine)

_U = "https://images.unsplash.com/photo-{id}?w=600&h=600&fit=crop&auto=format"

PRODUCT_IMAGES = {
    "armani-code":      [_U.format(id="1523293182086-7651a899d37f"), _U.format(id="1541643600914-78b084683702")],
    "hugo-boss":        [_U.format(id="1592945403244-b3fbafd7f539"), _U.format(id="1590156206657-aeffd4e1b1ac")],
    "versace-eros":     [_U.format(id="1616949870906-a41803e8da4d"), _U.format(id="1523293182086-7651a899d37f")],
    "davidoff-cw":      [_U.format(id="1541643600914-78b084683702"), _U.format(id="1592945403244-b3fbafd7f539")],
    "ysl-y":            [_U.format(id="1590156206657-aeffd4e1b1ac"), _U.format(id="1616949870906-a41803e8da4d")],
    "nike-am270":       [_U.format(id="1542291026-7eec264c27ff"), _U.format(id="1608231387042-66d1773070a5")],
    "adidas-ub23":      [_U.format(id="1608231387042-66d1773070a5"), _U.format(id="1543163521-1bf539c55dd2")],
    "puma-rsx":         [_U.format(id="1543163521-1bf539c55dd2"), _U.format(id="1556906781-9a412961a28c")],
    "nb-574":           [_U.format(id="1556906781-9a412961a28c"), _U.format(id="1597045566677-8cf032ed6634")],
    "reebok-classic":   [_U.format(id="1597045566677-8cf032ed6634"), _U.format(id="1542291026-7eec264c27ff")],
    "earbuds-pro":      [_U.format(id="1590658268037-6bf12165a8df"), _U.format(id="1606220838-1f6d4c3c6ba8")],
    "bt-speaker":       [_U.format(id="1608043152269-423dbba4e7e1"), _U.format(id="1545454675-3b625bfbeb08")],
    "usb-hub":          [_U.format(id="1600003263720-95b45a86035d"), _U.format(id="1563770660941-55234f33bec8")],
    "ring-light":       [_U.format(id="1497366811353-6870744d04b2"), _U.format(id="1515378791036-0648a3ef77b2")],
    "gan-charger":      [_U.format(id="1625772452859-1c03d5bf1137"), _U.format(id="1585771724684-b4ed66f8e07a")],
    "crystal-choker":   [_U.format(id="1515562141207-7a88fb7ce338"), _U.format(id="1535632066927-ab7c9ab60908")],
    "boho-ear-cuff":    [_U.format(id="1535632066927-ab7c9ab60908"), _U.format(id="1573408301185-9519f94cf3c2")],
    "layered-necklace": [_U.format(id="1599643478518-a784e5dc4c8f"), _U.format(id="1515562141207-7a88fb7ce338")],
    "charm-bracelet":   [_U.format(id="1573408301185-9519f94cf3c2"), _U.format(id="1602173574767-37ac01994b2a")],
    "statement-rings":  [_U.format(id="1602173574767-37ac01994b2a"), _U.format(id="1599643478518-a784e5dc4c8f")],
    "lego-classic":     [_U.format(id="1558618666-fcd25c85cd64"), _U.format(id="1594736797933-d0501ba2fe65")],
    "rc-car":           [_U.format(id="1594736797933-d0501ba2fe65"), _U.format(id="1558618666-fcd25c85cd64")],
    "slime-kit":        [_U.format(id="1596070982838-8ce6bb1a90f1"), _U.format(id="1563396983906-b3795482a59a")],
    "kinetic-sand":     [_U.format(id="1551698618-1dfe5d97d256"), _U.format(id="1596070982838-8ce6bb1a90f1")],
    "playdoh-mega":     [_U.format(id="1563396983906-b3795482a59a"), _U.format(id="1551698618-1dfe5d97d256")],
}

CATEGORIES = [
    {"name": "Perfumes",    "slug": "perfumes",     "icon": "🌸"},
    {"name": "Shoes",       "slug": "shoes",        "icon": "👟"},
    {"name": "Electronics", "slug": "electronics",  "icon": "🔌"},
    {"name": "Jewellery",   "slug": "jewellery",    "icon": "💍"},
    {"name": "Toys",        "slug": "toys",         "icon": "🧸"},
]

PRODUCTS = [
    # Perfumes
    {"name": "Armani Code EDP",        "slug": "armani-code",       "category": "perfumes",     "price": 12500, "original_price": 15000, "stock": 30, "rating": 4.8, "review_count": 124, "featured": True,  "desc": "A seductive and sophisticated fragrance with warm woody notes. Imported from UAE."},
    {"name": "Hugo Boss Bottled",      "slug": "hugo-boss",         "category": "perfumes",     "price": 9800,  "original_price": 12000, "stock": 25, "rating": 4.6, "review_count": 89,  "featured": False, "desc": "A timeless classic fragrance for men with apple and cinnamon top notes."},
    {"name": "Versace Eros EDP",       "slug": "versace-eros",      "category": "perfumes",     "price": 14200, "original_price": 18000, "stock": 20, "rating": 4.9, "review_count": 201, "featured": True,  "desc": "Inspired by Greek mythology. Fresh mint, green apple and lemon zest."},
    {"name": "Davidoff Cool Water",    "slug": "davidoff-cw",       "category": "perfumes",     "price": 6500,  "original_price": 8000,  "stock": 40, "rating": 4.4, "review_count": 67,  "featured": False, "desc": "Fresh aquatic scent with notes of sea water, mint and lavender."},
    {"name": "YSL Y EDP",             "slug": "ysl-y",             "category": "perfumes",     "price": 16800, "original_price": 20000, "stock": 15, "rating": 4.7, "review_count": 156, "featured": True,  "desc": "Modern and energetic. Bergamot, ginger and sage with a woody base."},
    # Shoes
    {"name": "Nike Air Max 270",       "slug": "nike-am270",        "category": "shoes",        "price": 18500, "original_price": 22000, "stock": 18, "rating": 4.7, "review_count": 342, "featured": True,  "desc": "Imported original Nike Air Max 270. Maximum air cushioning for all-day comfort."},
    {"name": "Adidas Ultraboost 23",   "slug": "adidas-ub23",       "category": "shoes",        "price": 22000, "original_price": 27000, "stock": 12, "rating": 4.8, "review_count": 278, "featured": True,  "desc": "Energy-returning Boost midsole. Primeknit+ upper. Imported from Germany."},
    {"name": "Puma RS-X",              "slug": "puma-rsx",          "category": "shoes",        "price": 13500, "original_price": 16000, "stock": 22, "rating": 4.5, "review_count": 145, "featured": False, "desc": "Bold chunky design with mesh upper. Running System technology from the 80s reimagined."},
    {"name": "New Balance 574",        "slug": "nb-574",            "category": "shoes",        "price": 15800, "original_price": 19000, "stock": 20, "rating": 4.6, "review_count": 198, "featured": False, "desc": "Classic silhouette with ENCAP midsole technology. Premium suede and mesh upper."},
    {"name": "Reebok Classic Leather", "slug": "reebok-classic",    "category": "shoes",        "price": 11200, "original_price": 14000, "stock": 28, "rating": 4.4, "review_count": 112, "featured": False, "desc": "The iconic 1983 design. Soft garment leather upper for all-day comfort."},
    # Electronics
    {"name": "Wireless Earbuds Pro",   "slug": "earbuds-pro",       "category": "electronics",  "price": 4500,  "original_price": 6000,  "stock": 50, "rating": 4.3, "review_count": 567, "featured": True,  "desc": "Active noise cancellation, 30hr battery, IPX5 waterproof. Imported."},
    {"name": "JBL-Style BT Speaker",   "slug": "bt-speaker",        "category": "electronics",  "price": 3800,  "original_price": 5000,  "stock": 35, "rating": 4.5, "review_count": 423, "featured": False, "desc": "360° surround sound, waterproof, 12hr playtime. Party Boost connect."},
    {"name": "USB-C Hub 7-in-1",       "slug": "usb-hub",           "category": "electronics",  "price": 2200,  "original_price": 3000,  "stock": 60, "rating": 4.6, "review_count": 312, "featured": False, "desc": "4K HDMI, 100W PD, 3x USB-A, SD/MicroSD card reader. Aluminum body."},
    {"name": "Ring Light 26cm",        "slug": "ring-light",        "category": "electronics",  "price": 2800,  "original_price": 3500,  "stock": 45, "rating": 4.4, "review_count": 234, "featured": False, "desc": "3 light modes, 10 brightness levels, phone holder included. For content creators."},
    {"name": "65W GaN Fast Charger",   "slug": "gan-charger",       "category": "electronics",  "price": 3200,  "original_price": 4200,  "stock": 55, "rating": 4.7, "review_count": 389, "featured": True,  "desc": "Compact GaN technology. Charges laptop + 2 phones simultaneously. Imported."},
    # Jewellery
    {"name": "Crystal Choker Set",     "slug": "crystal-choker",    "category": "jewellery",    "price": 1200,  "original_price": 1800,  "stock": 35, "rating": 4.5, "review_count": 189, "featured": True,  "desc": "18k gold-plated with Austrian crystals. Includes necklace + earrings."},
    {"name": "Boho Ear Cuff Set",      "slug": "boho-ear-cuff",     "category": "jewellery",    "price": 850,   "original_price": 1200,  "stock": 40, "rating": 4.3, "review_count": 134, "featured": False, "desc": "Set of 6 ear cuffs, no piercing required. Rose gold finish."},
    {"name": "Layered Gold Necklace",  "slug": "layered-necklace",  "category": "jewellery",    "price": 1600,  "original_price": 2200,  "stock": 28, "rating": 4.6, "review_count": 211, "featured": False, "desc": "3-layer chain necklace with star, moon and heart pendants. Imported."},
    {"name": "Charm Bracelet Set",     "slug": "charm-bracelet",    "category": "jewellery",    "price": 950,   "original_price": 1400,  "stock": 32, "rating": 4.4, "review_count": 98,  "featured": False, "desc": "Set of 3 gold-plated bracelets. Mix of bangles, cuff and chain styles."},
    {"name": "Statement Ring Set",     "slug": "statement-rings",   "category": "jewellery",    "price": 720,   "original_price": 1000,  "stock": 45, "rating": 4.2, "review_count": 76,  "featured": False, "desc": "Set of 5 rings — geometric, vintage, and floral designs. Adjustable size."},
    # Toys
    {"name": "LEGO Classic 1000pcs",   "slug": "lego-classic",      "category": "toys",         "price": 8500,  "original_price": 11000, "stock": 15, "rating": 4.9, "review_count": 445, "featured": True,  "desc": "1000 classic LEGO bricks in 33 colors. Build anything you imagine. Age 4+."},
    {"name": "RC Racing Car",          "slug": "rc-car",            "category": "toys",         "price": 3500,  "original_price": 5000,  "stock": 22, "rating": 4.5, "review_count": 287, "featured": False, "desc": "1:18 scale RC car, 40km/h top speed, 2.4GHz control, 30 min battery."},
    {"name": "Slime Kit Deluxe",       "slug": "slime-kit",         "category": "toys",         "price": 1800,  "original_price": 2500,  "stock": 30, "rating": 4.6, "review_count": 356, "featured": False, "desc": "36-piece kit with glitter, foam beads, colors. Non-toxic. Age 6+."},
    {"name": "Kinetic Sand 2kg",       "slug": "kinetic-sand",      "category": "toys",         "price": 2200,  "original_price": 3000,  "stock": 25, "rating": 4.7, "review_count": 312, "featured": False, "desc": "Original imported Kinetic Sand. Molds perfectly, never dries out. Age 3+."},
    {"name": "Play-Doh Mega Set",      "slug": "playdoh-mega",      "category": "toys",         "price": 2800,  "original_price": 3800,  "stock": 20, "rating": 4.8, "review_count": 198, "featured": True,  "desc": "65-piece mega set with 15 cans of dough and 50 accessories. Imported USA."},
]

USERS = [
    {"email": "admin@azmart.pk",   "full_name": "A&Z Admin",     "password": "Admin@123",  "role": Role.admin},
    {"email": "sara@example.com",  "full_name": "Sara Khan",      "password": "Sara@1234",  "role": Role.customer},
    {"email": "ali@example.com",   "full_name": "Ali Hassan",     "password": "Ali@12345",  "role": Role.customer},
]


def seed():
    db = SessionLocal()
    try:
        # Categories
        cat_map = {}
        for c in CATEGORIES:
            existing = db.query(Category).filter(Category.slug == c["slug"]).first()
            if not existing:
                obj = Category(**c)
                db.add(obj)
                db.flush()
                cat_map[c["slug"]] = obj.id
            else:
                cat_map[c["slug"]] = existing.id
        db.commit()

        # Products
        for p in PRODUCTS:
            slug = p["slug"]
            images = PRODUCT_IMAGES.get(slug, [
                f"https://picsum.photos/seed/{slug}/600/600",
                f"https://picsum.photos/seed/{slug}-b/600/600",
            ])
            existing = db.query(Product).filter(Product.name == p["name"]).first()
            if existing:
                existing.images = images
                continue
            prod = Product(
                name=p["name"],
                description=p["desc"],
                price=p["price"],
                original_price=p["original_price"],
                stock=p["stock"],
                rating=p["rating"],
                review_count=p["review_count"],
                images=images,
                is_featured=p["featured"],
                category_id=cat_map[p["category"]],
            )
            db.add(prod)
        db.commit()

        # Users
        user_map = {}
        for u in USERS:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                obj = User(
                    email=u["email"],
                    full_name=u["full_name"],
                    hashed_password=hash_password(u["password"]),
                    role=u["role"],
                )
                db.add(obj)
                db.flush()
                user_map[u["email"]] = obj.id
            else:
                user_map[u["email"]] = existing.id
        db.commit()

        # Sample orders
        if db.query(Order).count() == 0:
            products = db.query(Product).limit(10).all()
            orders_data = [
                {"user": "sara@example.com", "status": OrderStatus.delivered,  "city": "Karachi",   "items": [(0, 1), (2, 2)]},
                {"user": "ali@example.com",  "status": OrderStatus.shipped,    "city": "Lahore",    "items": [(4, 1), (6, 1)]},
                {"user": "sara@example.com", "status": OrderStatus.processing, "city": "Karachi",   "items": [(10, 3), (14, 1)]},
                {"user": "ali@example.com",  "status": OrderStatus.pending,    "city": "Islamabad", "items": [(15, 2), (20, 1)]},
                {"user": "sara@example.com", "status": OrderStatus.cancelled,  "city": "Karachi",   "items": [(1, 1)]},
            ]
            for od in orders_data:
                uid = user_map[od["user"]]
                items = []
                total = 0.0
                for idx, qty in od["items"]:
                    if idx < len(products):
                        p = products[idx]
                        items.append(OrderItem(
                            product_id=p.id,
                            product_name=p.name,
                            product_image=p.images[0] if p.images else None,
                            quantity=qty,
                            unit_price=p.price,
                        ))
                        total += p.price * qty
                order = Order(
                    user_id=uid,
                    status=od["status"],
                    total_amount=total,
                    full_name="Sample Customer",
                    phone="03001234567",
                    address="123 Main Street",
                    city=od["city"],
                    items=items,
                )
                db.add(order)
            db.commit()

        print("Database seeded successfully!")
        print("   Admin: admin@azmart.pk / Admin@123")
        print("   User1: sara@example.com / Sara@1234")
        print("   User2: ali@example.com / Ali@12345")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
