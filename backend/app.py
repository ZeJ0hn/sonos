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


def __check(data, keys):
    return all(k in data.keys() for k in keys)


@app.post("/api/tasks/create")
async def create_task(request: Request) -> HTTPResponse:
    data = request.json

    if not __check(data, ('name',)):
        return InvalidUsage("Payload must contains only task name")

    task_id = _connector.create_task(name=data['name'])

    return jsonify({
        'id': task_id
    })


@app.get("/api/tasks")
async def get_tasks(request: Request) -> HTTPResponse:
    tasks = _connector.get_tasks()

    return jsonify(tasks)


@app.get("/api/tasks/<task_id:int>")
async def get_task(request: Request, task_id: int) -> HTTPResponse:
    task = _connector.get_task(task_id=task_id)

    return jsonify(task)


@app.delete("/api/tasks/<task_id:int>/delete")
async def get_task(request: Request, task_id: int) -> HTTPResponse:
    _connector.delete_task(task_id=task_id)

    return empty(200)


@app.post("/api/tasks/<task_id:int>/done")
async def get_tasks(request: Request, task_id: int) -> HTTPResponse:
    _connector.mark_processed(task_id=task_id)

    return empty(status=200)


@app.post("/api/tasks/<task_id:int>/audios/create")
async def add_audio(request: Request, task_id: int) -> HTTPResponse:
    if len(request.files) != 1:
        return InvalidUsage("Form must contains just one files")

    name = next(iter(request.files))
    file = request.files.get(name)

    audio_id = _connector.create_audio(task_id=task_id, name=name, data=file.body)

    return jsonify({
        'id': audio_id
    })


@app.get("/api/tasks/<task_id:int>/audios")
async def get_audios(request: Request, task_id: int) -> HTTPResponse:
    audios = _connector.get_audios(task_id=task_id)

    return jsonify(audios)


@app.get("/api/tasks/<task_id:int>/audios/<audio_id:int>")
async def get_audio(request: Request, task_id: int, audio_id: int) -> HTTPResponse:
    audio = _connector.get_audio(task_id=task_id, audio_id=audio_id)

    return jsonify(audio)


@app.delete("/api/tasks/<task_id:int>/audios/<audio_id:int>/delete")
async def delete_audio(request: Request, task_id: int, audio_id: int) -> HTTPResponse:
    _connector.delete_audio(task_id=task_id, audio_id=audio_id)

    return empty(200)


@app.get("/api/tasks/<task_id:int>/audios/<audio_id:int>/track")
async def get_track(request: Request, task_id: int, audio_id: int) -> HTTPResponse:
    data = _connector.get_audio_data(task_id=task_id, audio_id=audio_id)

    return raw(data)


@app.post("/api/tasks/<task_id:int>/audios/<audio_id:int>/annotate")
async def annotate_audio(request: Request, task_id: int, audio_id: int) -> HTTPResponse:
    data = request.json

    if not __check(data, ('wakeword_start', 'wakeword_start', 'utterance_start', 'utterance_end')):
        return InvalidUsage("Payload must contains: wakeword_start, wakeword_start, utterance_start, utterance_end")

    _connector.annotate_audio(audio_id=audio_id, **data)

    return empty(status=200)


@app.post("/api/tasks/<task_id:int>/audios/<audio_id:int>/done")
async def process_audio(request: Request, task_id: int, audio_id: int) -> HTTPResponse:
    _connector.mark_done(task_id=task_id, audio_id=audio_id)

    return empty(status=200)


@app.post("/api/tasks/<task_id:int>/audios/<audio_id:int>/skip")
async def skip_audio(request: Request, task_id: int, audio_id: int) -> HTTPResponse:
    _connector.mark_skip(task_id=task_id, audio_id=audio_id)

    return empty(status=200)


if __name__ == "__main__":  # pragma: no cover
    app.run()
