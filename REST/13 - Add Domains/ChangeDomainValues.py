import Security
import requests
import datetime
import json
import os
import Security

_featureLayerUrl = "https://services.arcgis.com/emS4w7iyWEQiulAb/arcgis/rest/services/EGT19_REST_MarkantObject/FeatureServer/0"
_fieldName = "PROVINCIE"
_csvFile = "provincies.csv"

def main():
   
    print("opening CSV")
    f = open(os.path.join(os.path.split(__file__)[0],_csvFile),"r")
    lines = f.readlines()
    newCodedValues = []
    for line in lines:
        parts = line.split(",")
        newCodedValues.append({"code":parts[0],"name":parts[1].strip()})

    print("Getting token")
    token = Security.GenerateToken()

    print("Getting service info")
    layerInfoUrl = "{}?f=json&token={}".format(_featureLayerUrl,token)
    layerInfo = requests.get(layerInfoUrl).json()
    currentField = [field for field in layerInfo["fields"] if field["name"]==_fieldName][0]
    print("Currently field {} has {} domain values".format(_fieldName,len(currentField["domain"]["codedValues"])))

    currentField["domain"]["codedValues"] = newCodedValues
    print("Updating field {} to have  {} domain values".format(_fieldName,len(newCodedValues)))

    featureLayerAdminUrl = _featureLayerUrl.replace("/rest/","/rest/admin/")
    params = {"f":"json","token":token}
    params["updateDefinition"] = json.dumps({"fields":[currentField]})
    
    layerUpdateUrl = "{}/updateDefinition".format(featureLayerAdminUrl)
    print("Sending request ")
    layerResult = requests.post(layerUpdateUrl,params).json()
    print(layerResult)

    print("script complete")

if __name__=="__main__":
    main()
