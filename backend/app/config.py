from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "azmart-super-secret-jwt-key"
    database_url: str = "sqlite:///./azmart.db"
    access_token_expire_minutes: int = 1440
    algorithm: str = "HS256"

    # SMTP — leave blank to disable email notifications
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""  # your-gmail@gmail.com
    smtp_pass: str = ""  # Gmail App Password
    seller_email: str = ""  # where order notifications are sent

    class Config:
        env_file = ".env"


settings = Settings()
