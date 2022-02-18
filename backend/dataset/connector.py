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
            SELECT id, name, processed 
            FROM Tasks
            """)
            rows = curs.fetchall()

            result = []
            for row in rows:
                result.append({
                    'id': row[0],
                    'name': row[1],
                    'processed': bool(row[2] == 1)
                })

            return result

    def get_task(self, task_id: str) -> Dict[str, str]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name, processed 
            FROM Tasks 
            WHERE id = %s
            """, (task_id,))
            row = curs.fetchone()

            return {
                'id': row[0],
                'name': row[1],
                'processed': row[2]
            }

    def mark_processed(self, task_id: str) -> None:
        with self.cursor as curs:
            curs.execute("""
            UPDATE Tasks 
            SET processed = True 
            WHERE id = %s
            """, (task_id,))
            self.__conn.commit()

    def create_audio(self,  task_id: int, name: str, data: bytes) -> str:
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
            SELECT id, name, status, wakeword_start, wakeword_end, utterance_start, utterance_end
            FROM Audios 
            LEFT JOIN Annotations USING(id)
            WHERE id = %s AND task_id = %s
            """, (audio_id, task_id,))
            row = curs.fetchone()

            annotations = {
                'wakeword_start': row[3],
                'wakeword_end': row[4],
                'utterance_start': row[5],
                'utterance_end': row[6]
            } if row[3] and row[4] and row[5] and row[6] else {}

            return {
                'id': row[0],
                'name': row[1],
                'status': row[2],
                'annotations': annotations
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
