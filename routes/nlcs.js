var axios = require("axios");
var FormData = require("form-data");
var data = new FormData();
data.append("plotId", "LT1-808");

var config = {
  method: "post",
  url: "https://api.nlcs.gov.bt/api/urban/get-plot/",
  headers: {
    PHP_AUTH_USER: "MOWHS_DHS_MobileApp_api_user",
    PHP_AUTH_PW: "eSakor_Plot_xMcEmBBgcYMMIfZwPNzRvmQdqM3q473xVBOW",
    Authorization:
      "Basic TU9XSFNfREhTX01vYmlsZUFwcF9hcGlfdXNlcjplU2Frb3JfUGxvdF94TWNFbUJCZ2NZTU1JZlp3UE56UnZtUWRxTTNxNDczeFZCT1c=",
    ...data.getHeaders(),
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
