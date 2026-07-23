import os
import tempfile

import pytest

# Env vars must be set before any `app.*` module is imported, since
# app.config.Settings() reads them at import time. A dedicated temp-file
# SQLite DB keeps tests fully isolated from the real azmart.db.
_TEST_DB_FD, _TEST_DB_PATH = tempfile.mkstemp(suffix=".db")
os.close(_TEST_DB_FD)
os.environ["DATABASE_URL"] = f"sqlite:///{_TEST_DB_PATH}"
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-real-use")
os.environ.setdefault("FRONTEND_ORIGINS", "http://localhost:3000")
# GEMINI_API_KEY deliberately left unset — tests exercise the rule-based
# fallback path, never a real Gemini call.

from fastapi.testclient import TestClient  # noqa: E402
from app.database import Base, SessionLocal, engine  # noqa: E402
from app.dependencies import get_db  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(autouse=True)
def _clean_db():
    """Fresh, empty schema for every test — the temp SQLite file is shared
    across the whole run, so tests would otherwise see each other's data."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture()
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db_session):
    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
