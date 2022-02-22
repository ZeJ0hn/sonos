from typing import Dict, Union, List

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

    def get_tasks(self) -> List[Dict[str, Union[str, bool]]]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name
            FROM Tasks
            """)
            rows = curs.fetchall()

            result = []
            for row in rows:
                result.append({
                    'id': row[0],
                    'name': row[1],
                    'processed': self.__is_processed(row[0])
                })

            return result

    def get_task(self, task_id: int) -> Dict[str, Union[str, bool]]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name
            FROM Tasks
            WHERE id = %s
            """, (task_id,))
            row = curs.fetchone()

            return {
                'id': row[0],
                'name': row[1],
                'processed': self.__is_processed(row[0])
            }

    def delete_task(self, task_id: int) -> None:
        with self.cursor as curs:
            curs.execute("""
            DELETE FROM Tasks
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

    def get_audios(self, task_id: int) -> List[Dict[str, Union[str, bool]]]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name, status, wakeword_start, wakeword_end, utterance_start, utterance_end, text
            FROM Audios
            LEFT JOIN Annotations USING(id)
            WHERE task_id = %s
            """, (task_id,))
            rows = curs.fetchall()

            result = []
            for row in rows:
                audio = self.__build_audio(row)
                result.append(audio)

            return result

    def get_audio(self, task_id: int, audio_id: int) -> Dict[str, Union[str, bool]]:
        with self.cursor as curs:
            curs.execute("""
            SELECT id, name, status, wakeword_start, wakeword_end, utterance_start, utterance_end, text
            FROM Audios
            LEFT JOIN Annotations USING(id)
            WHERE id = %s AND task_id = %s
            """, (audio_id, task_id,))
            row = curs.fetchone()

            return self.__build_audio(row)

    def delete_audio(self, task_id: int, audio_id: int) -> None:
        with self.cursor as curs:
            curs.execute("""
            DELETE FROM Audios
            WHERE id = %s AND task_id = %s
            """, (audio_id, task_id,))
            self.__conn.commit()

    def get_audio_data(self, task_id: int, audio_id: int) -> bytes:
        with self.cursor as curs:
            curs.execute("""
            SELECT data
            FROM Audios
            WHERE id = %s AND task_id = %s
            """, (audio_id, task_id,))
            row = curs.fetchone()

            return row[0]

    def annotate_audio(self, audio_id: int,
                       wakeword_start: int,
                       wakeword_end: int,
                       utterance_start: int,
                       utterance_end: int,
                       text: str) -> None:
        with self.cursor as curs:
            curs.execute("""
            REPLACE INTO Annotations (id, wakeword_start, wakeword_end, utterance_start, utterance_end, text)
            VALUES(%s, %s, %s, %s, %s, %s)
            """, (audio_id, wakeword_start, wakeword_end, utterance_start, utterance_end, text))
            self.__conn.commit()

    def mark_done(self, task_id: int, audio_id: int) -> None:
        self.__mark_audio(task_id=task_id,
                          audio_id=audio_id,
                          status='Done')

    def mark_skip(self, task_id: int, audio_id: int) -> None:
        self.__mark_audio(task_id=task_id,
                          audio_id=audio_id,
                          status='Skip')

    def __mark_audio(self, task_id: int, audio_id: int, status: str) -> None:
        with self.cursor as curs:
            curs.execute("""
            UPDATE Audios
            SET status = %s
            WHERE id = %s AND task_id = %s
            """, (status, audio_id, task_id,))
            self.__conn.commit()

    def __is_processed(self, task_id: int) -> bool:
        with self.cursor as curs:
            curs.execute("""
            SELECT COUNT(status)
            FROM Audios
            WHERE task_id = %s and status = 'None'
            """, (task_id,))
            row = curs.fetchone()

            return bool(row[0] == 0)

    @staticmethod
    def __build_audio(row) -> Dict[str, Union[str, bool]]:
        audio = {
                    'id': row[0],
                    'name': row[1],
                    'status': row[2]
                }

        if row[3] and row[4] and row[5] and row[6]:
            audio['annotations'] = {
                        'wakeword_start': row[3],
                        'wakeword_end': row[4],
                        'utterance_start': row[5],
                        'utterance_end': row[6],
                        'text': row[7]
                    }

        return audio
