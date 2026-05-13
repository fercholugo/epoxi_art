from fastapi import APIRouter

from app.api.v1 import quotes, contact, auth, products

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/v1/auth", tags=["auth"])
api_router.include_router(quotes.router, prefix="/v1/quotes", tags=["quotes"])
api_router.include_router(contact.router, prefix="/v1/contact", tags=["contact"])
api_router.include_router(products.router, prefix="/v1/products", tags=["products"])
