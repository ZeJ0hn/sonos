import pytest
import app
import io
from dataset.database import connect
from collections import namedtuple

TASK_NAME_1 = 'task_name_1'
TASK_NAME_2 = 'task_name_2'

FILE_NAME = 'file_name'

FILE = [0] * 1000

@pytest.fixture(scope="session", autouse=True)
def clean_task():
    # First clean tables
    conn = connect()

    def clean(table):
        sql = f"DELETE FROM {table} WHERE True"
        conn.cursor().execute(sql)

    try:
        clean('Tasks')
        clean('Audios')
        conn.commit()
    finally:
        conn.close()


def test_tasks_no_task():
    _, response = app.app.test_client.get('/api/tasks')

    assert response.status_code == 200
    assert len(response.json) == 0


def test_tasks_creation_and_done():
    _, response = app.app.test_client.post('/api/tasks/create', json={'name': TASK_NAME_1})

    assert response.status_code == 200
    assert 'id' in response.json

    task_id_1 = response.json["id"]

    _, response = app.app.test_client.post('/api/tasks/create', json={'name': TASK_NAME_2})

    assert response.status_code == 200
    assert 'id' in response.json

    task_id_2 = response.json["id"]

# def test_tasks_get_task_by_id():
    assert task_id_1 or task_id_2

    _, response = app.app.test_client.get(f'/api/tasks/{task_id_1}')
    assert response.status_code == 200
    assert 'name' in response.json and response.json['name'] == TASK_NAME_1
    assert 'processed' in response.json and not response.json['processed']

    _, response = app.app.test_client.get(f'/api/tasks/{task_id_2}')
    assert response.status_code == 200
    assert 'name' in response.json and response.json['name'] == TASK_NAME_2
    assert 'processed' in response.json and not response.json['processed']    


# def test_tasks_done():
    _, response = app.app.test_client.post(f'/api/tasks/{task_id_2}/done')
    assert response.status_code == 200         


# def test_tasks_get_tasks():
    _, response = app.app.test_client.get('/api/tasks')

    assert response.status_code == 200
    assert len(response.json) == 2
    assert 'id' in response.json[0] and response.json[0]['id'] == task_id_1
    assert 'name' in response.json[0] and response.json[0]['name'] == TASK_NAME_1
    assert 'processed' in response.json[0] and not response.json[0]['processed']    

    assert 'id' in response.json[1] and response.json[1]['id'] == task_id_2
    assert 'name' in response.json[1] and response.json[1]['name'] == TASK_NAME_2
    assert 'processed' in response.json[1] and response.json[1]['processed']

    files = {FILE_NAME: io.BytesIO(bytes(FILE))}
    _, response = app.app.test_client.post(f'/api/tasks/{task_id_1}/audios/create', files=files)

    assert response.status_code == 200
    assert 'id' in response.json

    audio_id = response.json['id']

    _, response = app.app.test_client.get(f'/api/tasks/{task_id_1}/audios')

    assert response.status_code == 200
    assert 'id' in response.json[0] and response.json[0]['id'] == audio_id
    assert 'name' in response.json[0] and response.json[0]['name'] == FILE_NAME

    _, response = app.app.test_client.get(f'/api/tasks/{task_id_1}/audios/{audio_id}')

    assert response.status_code == 200
    assert 'id' in response.json and response.json['id'] == audio_id
    assert 'name' in response.json and response.json['name'] == FILE_NAME
    assert 'status' in response.json and response.json['status'] == 'None'

    _, response = app.app.test_client.post(f'/api/tasks/{task_id_1}/audios/{audio_id}/done')

    assert response.status_code == 200

    _, response = app.app.test_client.get(f'/api/tasks/{task_id_1}/audios/{audio_id}')

    assert response.status_code == 200
    assert 'status' in response.json and response.json['status'] == 'Done'
