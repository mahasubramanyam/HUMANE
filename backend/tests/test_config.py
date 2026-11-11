from app.core.config import settings


def test_settings_defaults():
    """Verify default configuration attributes."""
    assert settings.APP_NAME == "HUMANE"
    assert settings.API_V1_PREFIX == "/api/v1"
    assert settings.SESSION_COOKIE_NAME == "humane_session"
    assert settings.SESSION_EXPIRE_SECONDS > 0
    assert "http://localhost:3000" in settings.CORS_ORIGINS
