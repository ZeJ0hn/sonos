import pytest
import app
from dataset.database import connect

TASK_NAME_1 = 'task_name_1'
TASK_NAME_2 = 'task_name_2'

@pytest.fixture(scope="session", autouse=True)
def clean_task():
    # First clean tables
    conn = connect()
    try:
        sql = "DELETE FROM Tasks WHERE True"
        conn.cursor().execute(sql)
        conn.commit()
    finally:
        conn.close()

def test_tasks_no_task():
    _, response = app.app.test_client.get('/api/tasks')

    assert response.status_code == 200
    assert len(response.json) == 0


def test_tasks_create_one():
    _, response = app.app.test_client.post('/api/tasks/create', json={'name': TASK_NAME_1})

    assert response.status_code == 200
    assert 'id' in response.json

def test_tasks_get_tasks_1():
    _, response = app.app.test_client.get('/api/tasks')

    assert response.status_code == 200
    assert len(response.json) == 1
    assert 'name' in response.json[0] and response.json[0]['name'] == TASK_NAME_1

def test_tasks_create_two():
    _, response = app.app.test_client.post('/api/tasks/create', json={'name': TASK_NAME_2})

    assert response.status_code == 200
    assert 'id' in response.json

    task_id = response.json["id"]

    # FIXME Find a better way to test the get_task_by_id method
    _, response = app.app.test_client.get(f'/api/tasks/{task_id}')
    assert response.status_code == 200
    assert 'name' in response.json and response.json['name'] == TASK_NAME_2
    assert 'submitted' in response.json and not response.json['submitted']    

    _, response = app.app.test_client.post(f'/api/tasks/{task_id}/submit')

    assert response.status_code == 200      

    _, response = app.app.test_client.get(f'/api/tasks/{task_id}')
    assert response.status_code == 200
    assert 'submitted' in response.json and response.json['submitted']    

def test_tasks_get_tasks_2():
    _, response = app.app.test_client.get('/api/tasks')

    assert response.status_code == 200
    assert len(response.json) == 2
    assert 'name' in response.json[0] and response.json[0]['name'] == TASK_NAME_1
    assert 'submitted' in response.json[0] and not response.json[0]['submitted']    

    assert 'name' in response.json[1] and response.json[1]['name'] == TASK_NAME_2
    assert 'submitted' in response.json[1] and response.json[1]['submitted']    

       
