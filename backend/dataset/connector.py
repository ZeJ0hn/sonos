from typing import Dict, Union

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
            curs.execute("""
            INSERT INTO Tasks (name) 
            VALUES (%s)
            """, (name,))
            self.__conn.commit()

            return curs.lastrowid

    def get_tasks(self) -> Dict[str, str]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name, submitted 
            FROM Tasks
            """)
            rows = curs.fetchall()

            result = []
            for row in rows:
                result.append({
                    'id': row[0],
                    'name': row[1],
                    'submitted': bool(row[2] == 1)
                })

            return result

    def get_task(self, task_id: str) -> Dict[str, str]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name, submitted 
            FROM Tasks 
            WHERE id = %s
            """, (task_id,))
            row = curs.fetchone()

            return {
                'id': row[0],
                'name': row[1],
                'submitted': row[2]
            }

    def mark_finished(self, task_id: str) -> None:
        with self.cursor as curs:
            curs.execute("""
            UPDATE Tasks 
            SET processed = True 
            WHERE id = %s
            """, (task_id,))
            self.__conn.commit()

    def create_audio(self,  task_id: str, name: str, data: bytes) -> str:
        with self.cursor as curs:
            curs.execute("""
            INSERT INTO Audios (task_id, name, data) 
            VALUES (%s, %s, %s)
            """, (task_id, name, data,))
            self.__conn.commit()

            return curs.lastrowid

    def get_audios(self, task_id: str) -> Dict[str, Union[str, bool]]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name, status 
            FROM Audios 
            WHERE task_id = %s
            """, (task_id,))
            rows = curs.fetchall()

            result = []
            for row in rows:
                result.append({
                    'id': row[0],
                    'name': row[1],
                    'status': row[2]
                })

            return result

    def get_audio(self, task_id: str, audio_id: str) -> Dict[str, Union[str, bool]]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name, status 
            FROM Audios 
            WHERE id = %s AND task_id = %s
            """, (audio_id, task_id,))
            row = curs.fetchone()

            return {
                'id': row[0],
                'name': row[1],
                'submitted': row[2]
            }

    def get_audio_data(self, task_id: str, audio_id: str) -> bytes:
        with self.cursor as curs:
            curs.execute("""
            SELECT data 
            FROM Audios 
            WHERE id = %s AND task_id = %s
            """, (audio_id, task_id,))
            row = curs.fetchone()

            return row[0]

    def annotate_audio(self, audio_id: str,
                       wakeword_start: int,
                       wakeword_end: int,
                       utterance_start: int,
                       utterance_end: int) -> None:
        with self.cursor as curs:
            curs.execute("""
            INSERT INTO table (id, wakeword_start, wakeword_start, utterance_start, utterance_end) 
            VALUES(%s, %s, %s, %s, %s, ) 
            ON DUPLICATE KEY UPDATE
            """, (audio_id, wakeword_start, wakeword_end, utterance_start, utterance_end))
            self.__conn.commit()

    def mark_done(self, task_id: str, audio_id: str) -> None:
        self.__mark_audio(task_id=task_id,
                          audio_id=audio_id,
                          status='Done')

    def mark_skip(self, task_id: str, audio_id: str) -> None:
        self.__mark_audio(task_id=task_id,
                          audio_id=audio_id,
                          status='Skip')

    def __mark_audio(self, task_id: str, audio_id: str, status: str) -> None:
        with self.cursor as curs:
            curs.execute("""
            UPDATE Audios 
            SET status = %s 
            WHERE id = %s AND task_id = %s
            """, (status, audio_id, task_id,))
            self.__conn.commit()
