from app.services.auth_service import (
    create_access_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_hash_password_produces_a_verifiable_but_different_string():
    hashed = hash_password("Sara@1234")
    assert hashed != "Sara@1234"
    assert verify_password("Sara@1234", hashed)


def test_verify_password_rejects_wrong_password():
    hashed = hash_password("Sara@1234")
    assert not verify_password("wrong-password", hashed)


def test_access_token_round_trips_claims():
    token = create_access_token({"sub": "42", "role": "admin"})
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "42"
    assert payload["role"] == "admin"


def test_decode_token_rejects_garbage():
    assert decode_token("not-a-real-token") is None
