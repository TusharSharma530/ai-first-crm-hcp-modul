from fastapi.testclient import TestClient
from main import app
from datetime import date
client = TestClient(app)
data = client.get('/api/interactions/').json()
today = date.today()
for i in data:
    from datetime import datetime
    d = datetime.fromisoformat(i['interaction_date']).date()
    if d == today:
        print(f"id={i['id']} type={i['interaction_type']} date={i['interaction_date']}")
