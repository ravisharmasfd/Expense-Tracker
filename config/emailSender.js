var SibApiV3Sdk = require("sib-api-v3-sdk");

const { emailKey } = require("./env");

var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = emailKey;

const sendinblueApi = new SibApiV3Sdk.TransactionalEmailsApi();
module.exports = sendinblueApi;
