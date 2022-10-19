const config = require("config");
const logger = require("./logger");
const BaseApi = require("./lib/baseApi");

const baseApi = new BaseApi(config, logger);
baseApi.BaseApi = BaseApi;

module.exports = baseApi;
