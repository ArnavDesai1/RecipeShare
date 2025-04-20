const express = require('express');
const { getAllBlogs } = require("../controllers/recipeController"); // Only import getAllBlogs
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

// NewsAPI public endpoint
router.route('/blogs').get(getAllBlogs); // Public access for NewsAPI blogs

// Comment out or remove unused routes
/*
router
  .route('/')
  .get(getBlog)
  .post(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    addBlog
  );

router
  .route('/:id')
  .get(getBlog)
  .put(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    updateBlog
  )
  .delete(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    deleteBlog
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
  .route("/comment/:blogId/:commentId")
  .delete(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    deleteComment
  );
*/

module.exports = router;