"""Main module for the backend server"""

from sanic import Sanic
from sanic.exceptions import InvalidUsage
from sanic.request import Request
from sanic.response import HTTPResponse
from sanic.response import json as jsonify
from sanic_cors import CORS

from dataset.connector import Connector

app = Sanic(__name__)
CORS(app)

_connector = Connector()

@app.post("/api/task/create")
async def create_task(request: Request) -> HTTPResponse:
    """Method which receives the request for '/api/give-me-odds' endpoint

    Args:
        request: the Sanic request object. Requests should contains the empire data in JSON format

    Returns:
        The odds value encapsulated by a HTTP response

    Raises:
        InvalidUsage: If the input data is missing or wrong.
    """
    pass

@app.get("/api/tasks")
async def get_tasks(request: Request) -> HTTPResponse:
    pass

@app.get("/api/tasks/<task_id:str>")
async def get_tasks(request: Request, task_id: str) -> HTTPResponse:
    pass

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
