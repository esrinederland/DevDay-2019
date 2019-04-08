#http://devteam.esri.nl:6080/arcgis/rest/services/HelemaalAndersWebtool/GPServer

#http://devteam.esri.nl:6080/arcgis/rest/services/HelemaalAndersWebtool/GPServer/HelemaalAndersScript/execute

import requests
import os
import json
import time
#from Password import PassWord, UserName

print("Sending service request")
callServiceUrl = "http://devteam.esri.nl:6080/arcgis/rest/services/HelemaalAndersWebtool/GPServer/HelemaalAndersScript/execute"
params = {"f" : "json"}

r = requests.post(callServiceUrl,params)
result = r.json()["results"][0]["value"]

print(result)