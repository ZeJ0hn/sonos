from typing import Dict

from .database import connect
from mysql.connector.cursor import MySQLCursor


class Connector:

    def __init__(self) -> None:
        self.__conn = connect()

    @property
    def cursor(self) -> MySQLCursor:
        return self.__conn.cursor()

    def create_task(self, name: str) -> int:
        with self.cursor as curs:
            curs.execute("INSERT INTO Tasks (name) VALUES (%s)", (name,))
            self.__conn.commit()

            return curs.lastrowid

    def get_tasks(self) -> Dict[str, str]:
        with self.cursor as curs:
            curs.execute("SELECT id, name, submitted FROM Tasks")
            rows = curs.fetchall()

            result = []
            for row in rows:
                result.append({
                    'id': row[0],
                    'name': row[1],
                    'submitted': row[2]
                })

            return result

    def get_task(self, task_id) -> Dict[str, str]:
        with self.cursor as curs:
            curs.execute("SELECT id, name, submitted FROM Tasks WHERE id = %s", (task_id,))
            row = curs.fetchone()

            return {
                'id': row[0],
                'name': row[1],
                'submitted': row[2]
            }
