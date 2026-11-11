from fastapi.testclient import TestClient


def test_healthz_liveness(client: TestClient):
    """Verify that root /healthz returns 200 OK."""
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "live"
    assert data["app"] == "HUMANE"


def test_api_v1_health(client: TestClient):
    """Verify that /api/v1/health returns detailed health information."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data
    assert "version" in data
    assert "services" in data
    assert data["services"]["api"] == "operational"
    assert data["services"]["database"] == "configured"
