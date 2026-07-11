from fastapi.testclient import TestClient
from main import app
client = TestClient(app)
data = client.get('/api/interactions/').json()
for i in data[:5]:
    did = i['id']
    dt = i['interaction_date']
    fu = i.get('follow_up_required')
    tp = type(fu).__name__
    print(f"id={did} date={dt} follow_up={fu} type={tp}")
