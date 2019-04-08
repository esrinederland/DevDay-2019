#-------------------------------------------------------------------------------
# Name:        getbeer
# Purpose:     to demo running REST API analyses
#
# Author:      mjagt
#
# Created:     28-03-2019
# Copyright:   (c) esri nederland bv 2019
#-------------------------------------------------------------------------------
import requests
import os
import json
import time
import Security

print("Start - Get Beer Script")
   
### URL TO THE ESRI WORLD SERVICE AREA SERVICE
solveServiceAreaUrl = "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea"
### URL TO THE ESRI WORLD GEOCODING SERVICE
findAddressCandidatesUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
### URL TO THE ESRI GEOMETRY SERVER
geometryServerUrl = "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer/relation"

### ADDRESSES OF THE WTC AND THE ROTTERDAM BIERGARTEN
wtcAddress = "Beursplein 37, 3011 AA Rotterdam"
bierGartenAddress = "Schiestraat 18, 3013 BR Rotterdam"

### GET A TOKEN
print("Getting token")
token = Security.GenerateToken()

### GET COORDINATES OF THE WTC ROTTERDAM AND THE ROTTERDAM BIERGARTEN
print("Getting coordinates of WTC and Biergarten")
wtcParams = {
        "f": "json",
        "singleLine": wtcAddress,
        "outFields": "Match_addr,Addr_type"
}
beerParams = {
        "f": "json",
        "singleLine": bierGartenAddress,
        "outFields": "Match_addr,Addr_type"
}

r = requests.post(findAddressCandidatesUrl,wtcParams)
wtcLocation = r.json()["candidates"][0]["location"]

r = requests.post(findAddressCandidatesUrl,beerParams)
beerLocation = r.json()["candidates"][0]["location"]

### SET THE DESIRED TRAVELMODE
travelMode = {
        "attributeParameterValues":
        [
                {
                        "parameterName":"Restriction Usage","attributeName":"Walking",
                        "value":"PROHIBITED"
                },
                {
                        "parameterName":"Restriction Usage","attributeName":"Preferred for Pedestrians",
                        "value":"PREFER_LOW"
                },
                {
                        "parameterName":"Walking Speed (km/h)","attributeName":"WalkTime","value":5
                }
        ],
        "description":"Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel time. The walking speed is set to 5 kilometers per hour.",
        "impedanceAttributeName":"WalkTime",
        "simplificationToleranceUnits":"esriMeters",
        "uturnAtJunctions":"esriNFSBAllowBacktrack",
        "restrictionAttributeNames":
        [
                "Preferred for Pedestrians","Walking"
        ],
        "useHierarchy":"false",
        "simplificationTolerance":2,
        "timeAttributeName":"WalkTime",
        "distanceAttributeName":"Miles",
        "type":"WALK",
        "id":"caFAgoThrvUpkFBW",
        "name":"Walking Time"
        }

### SET THE MAXIMUM TIME TO WALK
walkTime = 10

### PERFORM THE SOLVE SERVICE AREA REQUEST
print("Creating the drive time polygon")
solveAreaParams = {"f" : "json",
        "facilities" : "{},{}".format(wtcLocation["x"],wtcLocation["y"]),
        "travelMode" : json.dumps(travelMode),
        "defaultBreaks" : [walkTime],
        "token": token}

r = requests.post(solveServiceAreaUrl,solveAreaParams)
serviceArea = r.json()["saPolygons"]["features"][0]["geometry"]

### PERFORM AN INTERSECT TO DETERMINE IF THE BIERGARTEN IS WITHIN 10 MIN WALKING DISTANCE OF THE WTC
print("Intersecting Biergarten location with drivetime polygon")
intersectParams = {
        "f": "json",
        "sr": 4326,
        "relation": "esriGeometryRelationIntersection",
        "geometries1": json.dumps({
                "geometryType":"esriGeometryPoint",
                "geometries": [beerLocation]
        }),
        "geometries2": json.dumps({
                "geometryType":"esriGeometryPolygon",
                "geometries": [serviceArea]
        })
}

r = requests.post(geometryServerUrl,intersectParams)
relations = r.json()["relations"]

### IF THE RELATIONS LIST IS NOT EMPTY, THE BIERGARTEN IS WITHIN 10 MIN WALKING DISTANCE OF THE WTC
if len(relations) > 0:
        print("Yeej! The Rotterdam Biergarten is within {} minutes walking from the WTC Rotterdam. Let's go! :-)".format(walkTime))
else:
        print("Unfortunately the Rotterdam Biergarten is too far to walk from the WTC Rotterdam")

print("Get Beer script complete")