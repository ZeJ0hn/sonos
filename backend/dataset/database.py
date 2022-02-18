import os

import mysql.connector
from mysql.connector import errorcode, MySQLConnection
from sanic.log import logger

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
        processed   BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB;
"""

TABLES['Audios'] = """
    CREATE TABLE IF NOT EXISTS Audios (
        id          MEDIUMINT NOT NULL AUTO_INCREMENT,
        task_id     MEDIUMINT NOT NULL,
        name        VARCHAR(256)  NOT NULL,
        data        BLOB NOT NULL,
        status      ENUM('None', 'Done', 'Skip') NOT NULL DEFAULT 'None',
        PRIMARY KEY (id),
        FOREIGN KEY (task_id)
            REFERENCES Tasks(id)
            ON DELETE CASCADE
    ) ENGINE=InnoDB;
"""

TABLES['Annotations'] = """
    CREATE TABLE IF NOT EXISTS Annotations (
        id   MEDIUMINT NOT NULL,
        wakeword_start INT NOT NULL,
        wakeword_end INT NOT NULL,
        utterance_start INT NOT NULL,
        utterance_end INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (id)
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
        db_host = os.getenv('DB_HOST', 'localhost')
        db_user = os.getenv('DB_USER', 'user')
        db_password = os.getenv('DB_PASSWORD', 'password')
        db_database = os.getenv('DB_USER', 'Datasets')

        # connect to the PostgreSQL server
        logger.info('Connecting to the PostgreSQL database...')

        conn = mysql.connector.connect(host=db_host,
                                       user=db_user,
                                       password=db_password,
                                       database=db_database)

        return conn
    except (Exception) as error:
        logger.exception(error)

    return None
