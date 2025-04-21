const express = require("express");
const {
  getAllRecipes,
  getRecipe,
  addRecipe,
  updateRecipe,
  rateRecipe,
  deleteRecipe,
  addComment,
  deleteComment,
  toggleFavoriteRecipe,
  getAllBlogs,
} = require("../controllers/recipeController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/")
  .get(getAllRecipes) // Public access
  .post(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    addRecipe
  );

router
  .route("/rate/:id")
  .put(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    rateRecipe
  );

router
  .route("/:id")
  .get(getRecipe)
  .put(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    updateRecipe
  )
  .delete(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    deleteRecipe
  );

router
  .route("/comment/:id")
  .put(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    addComment
  );

router
  .route("/comment/:recipeId/:commentId")
  .delete(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    deleteComment
  );

router
  .route("/favorite/:id")
  .put(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    toggleFavoriteRecipe
  );

router
  .route("/blogs")
  .get(getAllBlogs); // Public access

module.exports = router;