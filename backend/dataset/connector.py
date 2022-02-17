from .database import connect

class Connector:

    def __init__(self) -> None:
        self.conn = connect()