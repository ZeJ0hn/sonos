import psycopg2
import logging

from .config import config


def connect():
    """ Connect to the PostgreSQL database server """
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        logging.info('Connecting to the PostgreSQL database...')

        return psycopg2.connect(**params)
		
        # # create a cursor
        # cur = conn.cursor()
        
	    # # execute a statement
        # print('PostgreSQL database version:')
        # cur.execute('SELECT version()')

        # # display the PostgreSQL database server version
        # db_version = cur.fetchone()
        # print(db_version)
       
	# close the communication with the PostgreSQL
        # cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        logging.exception(error)

    return None

