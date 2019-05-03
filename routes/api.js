var express = require("express");
var router = express.Router();
var fs = require("fs");
var utils = require("util");
var path = require("path");

const fs_readdir = utils.promisify(fs.readdir);
const fs_readFile = utils.promisify(fs.readFile);

router.get("/check-status", async function(req, res, next) {
  try {
    const conf_form_json = await fs_readdir(
      path.join(__dirname, "../tmp/conf-form-json")
    );
    const conf_form_mapping = await fs_readdir(
      path.join(__dirname, "../tmp/conf-form-mapping")
    );
    const conf_form_translation = await fs_readdir(
      path.join(__dirname, "../tmp/conf-form-translation")
    );

    res.send({
      status: "ok",
      conf_form_json,
      conf_form_mapping,
      conf_form_translation
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/conf-form-json", async function(req, res, next) {
  try {
    const jsons = await readFilesToJsons("../tmp/conf-form-json");

    res.send({
      status: "ok",
      jsons
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/conf-form-mapping", async function(req, res, next) {
  try {
    const jsons = await readFilesToJsons("../tmp/conf-form-mapping");

    res.send({
      status: "ok",
      jsons
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/conf-form-translation/:formId", async function(req, res, next) {
  if (!req.params.formId) {
    return res.send({
      status: "missing_params",
      params: ["formId"]
    });
  }
  const { formId } = req.params;

  try {
    const jsons = await readFilesToJsons(
      `../tmp/conf-form-translation/${formId}`
    );

    res.send({
      status: "ok",
      jsons
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/translation", async function(req, res, next) {
  try {
    const jsons = await readFilesToJsons("../tmp/translation");

    res.send({
      status: "ok",
      jsons
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("*", function(req, res, next) {
  return res.send({
    status: "not_found"
  });
});

module.exports = router;

const readFilesToJsons = async dirPath => {
  const files = await fs_readdir(path.join(__dirname, dirPath));

  const buffers = await Promise.all(
    files
      .filter(file => file.includes(".json"))
      .map(file => fs_readFile(path.join(__dirname, dirPath, file)))
  );

  const jsons = buffers.reduce((acc, buffer, i) => {
    const file = files[i];
    try {
      const json = JSON.parse(buffer.toString());
      return { ...acc, [file]: json };
    } catch (error) {
      return { ...acc, [file]: error.name };
    }
  }, {});

  return jsons;
};
