const express = require("express");
const { subscribe } = require("../controllers/subscriptionController.js");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/subscribe")
  .post(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser),
    ],
    subscribe
  );

module.exports = router;