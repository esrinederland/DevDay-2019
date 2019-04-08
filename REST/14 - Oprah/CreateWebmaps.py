#-------------------------------------------------------------------------------
# Name:        CreateWebmaps
# Purpose:     to demo the creation of a webmap per feature
#
# Author:      mvanhulzen
#
# Created:     15-10-2018
# Copyright:   (c) Esri Nederland BV 2018
#-------------------------------------------------------------------------------

import requests
import json
import Security
import copy


templatewebmapid = "e6b4b34182c24efeb1023fc4ee175306"
layerUrl = "https://services.arcgis.com/emS4w7iyWEQiulAb/arcgis/rest/services/survey123_fad6d08060964bc482a2ed3aa90f4eef/FeatureServer/0"

print("getting token")
token = Security.GenerateToken()

defaultParams = {"f":"json","token":token}

print("getting template webmap")
webmapInfoUrl = "https://www.arcgis.com/sharing/rest/content/items/{}".format(templatewebmapid)
r = requests.get(webmapInfoUrl,defaultParams)
webmapInfo = r.json()

webmapDataUrl = f"{webmapInfoUrl}/data"
r = requests.get(webmapDataUrl,defaultParams)
webmapData = r.json()

print("getting folder id")
folderid = webmapInfo["ownerFolder"]

print("get features from service")
queryParams = defaultParams.copy()
queryParams["where"] = "1=1"
queryParams["outFields"] =  "*"

queryUrl = f"{layerUrl}/query"
r = requests.get(queryUrl,queryParams)
surveyValues = r.json()["features"]

for feature in surveyValues:
    naam = feature["attributes"]["naam"]
    oid = feature["attributes"]["ObjectId"]
    leuk = feature["attributes"]["watleuks"]
    print("Creating webmap for {}".format(naam))

    newWebmapData = copy.deepcopy(webmapData)
    newWebmapData["operationalLayers"][0]["layerDefinition"]["definitionExpression"] = f"ObjectID={oid}"

    webmapInfo = defaultParams.copy()
    webmapInfo["title"] = f"Generated webmap for {naam}"
    webmapInfo["tags"] = f"EGT19Generated,REST,Demo,{naam}"
    webmapInfo["description"] = f"Hello {naam}, this is a newly created webmap. You said: {leuk}"
    webmapInfo["type"] = "Web Map"
    webmapInfo["text"] = json.dumps(newWebmapData)

    addItemurl = f"https://www.arcgis.com/sharing/rest/content/users/{Security.GetUsername()}/{folderid}/addItem"

    r = requests.post(addItemurl,webmapInfo)

    print(r.text)