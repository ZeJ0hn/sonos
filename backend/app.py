"""Main module for the backend server"""

from sanic import Sanic, json
from sanic.exceptions import InvalidUsage
from sanic.request import Request
from sanic.response import HTTPResponse
from sanic.response import json as jsonify, empty, raw
from sanic_cors import CORS

from dataset.connector import Connector
from dataset.database import SetUp

app = Sanic(__name__)
CORS(app)

_connector = Connector()
SetUp(_connector)


@app.post("/api/tasks/create")
async def create_task(request: Request) -> HTTPResponse:
    data = request.json

    # TODO Add parameters check
    task_id = _connector.create_task(name=data['name'])

    return jsonify({
        'id': task_id
    })


@app.get("/api/tasks")
async def get_tasks(request: Request) -> HTTPResponse:
    tasks = _connector.get_tasks()

    return jsonify(tasks)


@app.get("/api/tasks/<task_id:str>")
async def get_task(request: Request, task_id: str) -> HTTPResponse:
    task = _connector.get_task(task_id=task_id)

    return jsonify(task)


@app.post("/api/tasks/<task_id:str>/finish")
async def get_tasks(request: Request, task_id: str) -> HTTPResponse:
    _connector.mark_finished(task_id=task_id)

    return empty(status=200)


@app.post("/api/tasks/<task_id:str>/audios/create")
async def add_audio(request: Request, task_id: str) -> HTTPResponse:
    # TODO Add parameters check
    name = request.form.get('name')
    data = request.files.get('data')

    audio_id = _connector.create_audio(task_id=task_id, name=name, data=data)

    return jsonify({
        'id': audio_id
    })


@app.get("/api/tasks/<task_id:str>/audios")
async def get_audios(request: Request, task_id: str) -> HTTPResponse:
    audios = _connector.get_audios(task_id=task_id)

    return jsonify(audios)


@app.get("/api/tasks/<task_id:str>/audios/<audio_id:str>")
async def get_audio(request: Request, task_id: str, audio_id: str) -> HTTPResponse:
    audio = _connector.get_audio(task_id=task_id, audio_id=audio_id)

    return jsonify(audio)


@app.get("/api/tasks/<task_id:str>/audios/<audio_id:str>/track")
async def get_track(request: Request, task_id: str, audio_id: str) -> HTTPResponse:
    data = _connector.get_audio_data(task_id=task_id, audio_id=audio_id)

    return raw(data)


@app.post("/api/tasks/<task_id:str>/audios/<audio_id:str>/annotate")
async def annotate_audio(request: Request, task_id: str, audio_id: str) -> HTTPResponse:
    data = request.json

    # TODO Add parameters check

    _connector.annotate_audio(audio_id=audio_id, **data)

    return empty(status=200)


@app.post("/api/tasks/<task_id:str>/audios/<audio_id:str>/done")
async def process_audio(request: Request, task_id: str, audio_id: str) -> HTTPResponse:
    _connector.mark_done(task_id=task_id, audio_id=audio_id)

    return empty(status=200)


@app.post("/api/tasks/<task_id:str>/audios/<audio_id:str>/skip")
async def skip_audio(request: Request, task_id: str, audio_id: str) -> HTTPResponse:
    _connector.mark_skip(task_id=task_id, audio_id=audio_id)

    return empty(status=200)


if __name__ == "__main__":  # pragma: no cover
    app.run()
