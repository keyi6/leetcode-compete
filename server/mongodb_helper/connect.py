import os
from pymongo import MongoClient, InsertOne
from uri import uri

def connect():
    client = MongoClient(uri())
    db = client.LeetcodeCompete

    return db
