import secrets
import sys
import warnings

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # No real default on purpose — see the check below. A hardcoded secret
    # in a public repo lets anyone forge a valid admin JWT without ever
    # logging in.
    secret_key: str = ""
    database_url: str = "sqlite:///./azmart.db"
    access_token_expire_minutes: int = 1440
    algorithm: str = "HS256"

    # SMTP — leave blank to disable email notifications
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""  # your-gmail@gmail.com
    smtp_pass: str = ""  # Gmail App Password
    seller_email: str = ""  # where order notifications are sent

    # Comma-separated list of allowed frontend origins for CORS, e.g.
    # "https://azmart.example.com,http://localhost:3000". Defaults to local
    # dev only — production deployments must set this explicitly.
    frontend_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # This is a public demo app — the admin account is meant to be logged
    # into by visitors, not a secret. Kept configurable (rather than
    # hardcoded in seed.py) so the deployed value can be rotated without a
    # code change and isn't permanently pinned to whatever's in git history.
    demo_admin_password: str = "Admin@123"

    # Gemini API for the product chatbot (backend/app/routers/chat.py)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-flash-latest"

    class Config:
        env_file = ".env"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]


settings = Settings()

if not settings.secret_key:
    if "pytest" in sys.modules:
        # Test runs don't set a real .env; generate a throwaway secret so
        # imports don't crash mid-test-suite.
        settings.secret_key = secrets.token_hex(32)
    else:
        warnings.warn(
            "SECRET_KEY is not set — generating a random one for this process only. "
            "Tokens issued now will stop validating on the next restart. "
            "Set SECRET_KEY in your environment before deploying.",
            stacklevel=1,
        )
        settings.secret_key = secrets.token_hex(32)
