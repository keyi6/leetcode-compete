import os
import urllib.parse
from dotenv import load_dotenv

def uri(database: str): 
    # read mongodb config date from .env
    load_dotenv()
    mongodb_user = os.getenv('mongodb_user')
    mongodb_password = os.getenv('mongodb_password')

    return 'mongodb://%s:%s@127.0.0.1:27017/%s?authSource=admin&uuidRepresentation=standard' % (
        urllib.parse.quote_plus(mongodb_user),
        urllib.parse.quote_plus(mongodb_password),
        database
    )
