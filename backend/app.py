"""Main module for the backend server"""

from sanic import Sanic, json
from sanic.exceptions import InvalidUsage
from sanic.request import Request
from sanic.response import HTTPResponse
from sanic.response import json as jsonify
from sanic_cors import CORS

from dataset.connector import Connector
from dataset.database import SetUp

app = Sanic(__name__)
CORS(app)

_connector = Connector()
SetUp(_connector)

@app.post("/api/task/create")
async def create_task(request: Request) -> HTTPResponse:
    data = request.json

    # TODO Add parameters check
    task_id = _connector.create_task(data['name'])

    return jsonify({
        'id': task_id
    })

@app.get("/api/tasks")
async def get_tasks(request: Request) -> HTTPResponse:
    tasks = _connector.get_tasks()

    return jsonify(tasks)

@app.get("/api/tasks/<task_id:str>")
async def get_task(request: Request, task_id: str) -> HTTPResponse:
    task = _connector.get_task(task_id)

    return jsonify(task)

@app.get("/api/tasks/<task_id:str>/submit")
async def get_tasks(request: Request, task_id: str) -> HTTPResponse:
    pass

@app.post("/api/tasks/<task_id:str>/audios/create")
async def add_audio(request: Request, task_id: str) -> HTTPResponse:
    pass

@app.get("/api/tasks/<task_id:str>/audios/<audio_id:str>")
async def get_audio(request: Request, task_id: str, audio_id: str) -> HTTPResponse:
    pass

@app.get("/api/tasks/<task_id:str>/audios/<audio_id:str>/track")
async def get_track(request: Request, task_id: str, audio_id: str) -> HTTPResponse:
    pass

@app.get("/api/tasks/<task_id:str>/audios")
async def get_audios(request: Request, task_id: str) -> HTTPResponse:
    pass

@app.post("/api/tasks/<task_id:str>/audios/<audio_id:str>/annotate")
async def annotate_audio(request: Request, task_id: str) -> HTTPResponse:
    pass

@app.post("/api/tasks/<task_id:str>/audios/<audio_id:str>/skip")
async def annotate_audio(request: Request, task_id: str) -> HTTPResponse:
    pass


if __name__ == "__main__": # pragma: no cover
    app.run()
