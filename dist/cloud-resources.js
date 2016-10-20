if (window.ag == null) {
  window.ag = {};
}
window.ag.data = {
  "options": {
    "baseUrl": "https://rest-api.appgyver.com/v2",
    "headers": {
      "steroidsApiKey": "adb4e0dedb073c5f0ed4f21d133a9158873842cfaf60d5a9966c2c516a86587a",
      "steroidsAppId": 146152
    }
  },
  "resources": {
    "Product": {
      "schema": {
        "fields": {
          "Rate": {
            "type": "integer"
          },
          "Pid": {
            "type": "integer"
          },
          "Uid": {
            "type": "integer"
          },
          "Name": {
            "type": "string"
          },
          "Description": {
            "type": "string"
          },
          "Rating": {
            "type": "integer"
          },
          "id": {
            "type": "string",
            "identity": true
          }
        },
        "identifier": "id"
      }
    },
    "Users": {
      "schema": {
        "fields": {
          "Uid": {
            "type": "integer"
          },
          "Username": {
            "type": "string"
          },
          "id": {
            "type": "string",
            "identity": true
          }
        },
        "identifier": "id"
      }
    }
  }
};