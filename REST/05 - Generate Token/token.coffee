request = require 'request'

request.post {uri:'https://www.arcgis.com/sharing/rest/oauth2/token/', form:{'f' : 'json', 'client_id' : 'wRbmeMcGFrMT2kw4', 'client_secret' : '3627ea09f9814bfa8cbd02a5858ca3af', 'grant_type' : 'client_credentials'}, json : true}, (err,httpResponse,body) ->
  console.log body.access_token