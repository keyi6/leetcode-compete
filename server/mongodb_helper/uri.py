import os
import pathlib
import urllib.parse
from dotenv import load_dotenv

def uri(): 
    current_path = pathlib.Path(__file__).parent.resolve() 
    server_path = current_path.parent.resolve()
    dot_env_path = server_path.parent.resolve().absolute()

    load_dotenv(dot_env_path)

    # read mongodb config date from .env
    load_dotenv()
    mongodb_user = os.getenv('mongodb_user')
    mongodb_password = os.getenv('mongodb_password')

    return 'mongodb://%s:%s@127.0.0.1:27017/LeetcodeCompete' % (
        urllib.parse.quote_plus(mongodb_user),
        urllib.parse.quote_plus(mongodb_password))
