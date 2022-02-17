
import mysql.connector
from mysql.connector import errorcode, MySQLConnection
from sanic.log import logger

from .config import config

DB_NAME = "Datasets"

TABLES = {}
TABLES['Users'] = """
    CREATE TABLE IF NOT EXISTS Users (
        id          MEDIUMINT NOT NULL AUTO_INCREMENT,
        name        VARCHAR(128) NOT NULL,
        password    CHAR(32) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB;
"""

TABLES['Tasks'] = """
    CREATE TABLE IF NOT EXISTS Tasks (
        id          MEDIUMINT NOT NULL AUTO_INCREMENT,
        name        VARCHAR(128) NOT NULL,
        submited    BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB;
"""

TABLES['Audios'] = """
    CREATE TABLE IF NOT EXISTS Audios (
        id          MEDIUMINT NOT NULL AUTO_INCREMENT,
        task_id     MEDIUMINT NOT NULL,
        data        BLOB NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (task_id)
            REFERENCES Tasks(id)
            ON DELETE CASCADE
    ) ENGINE=InnoDB;
"""

TABLES['Annotations'] = """
    CREATE TABLE IF NOT EXISTS Annotations (
        audio_id   MEDIUMINT NOT NULL,
        type ENUM('wakeword', 'utterance'),
        start INT NOT NULL,
        end INT NOT NULL,
        FOREIGN KEY (audio_id)
            REFERENCES Audios(id)
            ON DELETE CASCADE
    ) ENGINE=InnoDB;
"""

def SetUp(connector) -> None:
    with connector.cursor as curs:
        for table_name in TABLES:
            table_description = TABLES[table_name]
            try:
                curs.execute(table_description)
                logger.info(f"Creating table {table_name}: OK")
            except mysql.connector.Error as err:
                    logger.info(f"Creating table {table_name}: {err.msg}")
                

def connect() -> MySQLConnection:
    """ Connect to the PostgreSQL database server """
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        logger.info('Connecting to the PostgreSQL database...')

        conn = mysql.connector.connect(**params)

        __set_database(conn)

        return conn
    except (Exception) as error:
        logger.exception(error)

    return None

def __set_database(conn: MySQLConnection) -> None:
    with conn.cursor() as curs:
        try:
            curs.execute(f"USE {DB_NAME}")
        except mysql.connector.Error as err:
            logger.info(f"Database {DB_NAME} does not exists. Try to create it...")
            if err.errno == errorcode.ER_BAD_DB_ERROR:
                try:
                    curs.execute(f"CREATE DATABASE {DB_NAME} DEFAULT CHARACTER SET 'utf8'")
                except mysql.connector.Error as err:
                    logger.error(f"Failed creating database: {err}")
                    exit(1)
                logger.info(f"Database {DB_NAME} created successfully.")
                conn.database = DB_NAME
            else:
                logger.error(err)
                exit(1)
