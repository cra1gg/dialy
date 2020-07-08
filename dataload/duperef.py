import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import requests

cred = credentials.Certificate("firebasecreds.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://phone2word.firebaseio.com/"
})

parent_ref = db.reference()
ref = db.reference('/mappings')
parent_ref.child("phonemappings").set(ref.get())