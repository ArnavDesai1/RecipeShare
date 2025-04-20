const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const axios = require('axios');

const getAllRecipes = async (req, res, next) => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const apiRecipes = response.data.meals || [];
    if (!apiRecipes.length) return res.status(200).json({ message: "No recipes found from API" });

    const recipes = apiRecipes.map(recipe => ({
      title: recipe.strMeal,
      image: recipe.strMealThumb,
      description: recipe.strInstructions,
      calories: 0,
      cookingTime: 30,
      ingredients: [recipe.strIngredient1, recipe.strIngredient2, recipe.strIngredient3, recipe.strIngredient4, recipe.strIngredient5]
        .filter(Boolean)
        .map(ing => ing.trim()),
      instructions: recipe.strInstructions.split('.').filter(step => step.trim().length > 0),
      author: null,
      createdAt: new Date(),
      ratings: [],
      idMeal: recipe.idMeal
    }));

    res.status(200).json(recipes);
  } catch (error) {
    console.error('API fetch error:', error);
    next(error);
  }
};

const getRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    const apiRecipe = response.data.meals?.[0];
    if (!apiRecipe) return res.status(404).json({ message: "Recipe not found" });

    const recipe = {
      title: apiRecipe.strMeal,
      image: apiRecipe.strMealThumb,
      description: apiRecipe.strInstructions,
      calories: 0,
      cookingTime: 30,
      ingredients: Object.keys(apiRecipe)
        .filter(key => key.startsWith('strIngredient') && apiRecipe[key])
        .map(key => apiRecipe[key].trim()),
      instructions: apiRecipe.strInstructions.split('.').filter(step => step.trim().length > 0),
      author: null,
      createdAt: new Date(),
      ratings: [],
      idMeal: apiRecipe.idMeal
    };

    res.status(200).json(recipe);
  } catch (error) {
    console.error('API fetch error:', error);
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) throw new Error("NewsAPI key not configured");

    const response = await axios.get(`https://newsapi.org/v2/everything?q=cooking&apiKey=${apiKey}&pageSize=10`); // Broadened query and increased to 10
    const apiBlogs = response.data.articles || [];

    const blogs = apiBlogs.map(article => ({
      title: article.title,
      image: article.urlToImage || "https://via.placeholder.com/300x200",
      description: article.description || "No description available",
      author: article.author || "Unknown Author",
      publishedAt: new Date(article.publishedAt),
      url: article.url
    }));

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Blog API fetch error:', error);
    next(error);
  }
};

const addRecipe = async (req, res, next) => {
  try {
    const {
      title,
      image,
      description,
      calories,
      cookingTime,
      ingredients,
      instructions,
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      !calories ||
      !cookingTime ||
      !ingredients.length ||
      !instructions.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    const recipe = Recipe({ ...req.body, author: req.user });
    await recipe.save();
    res.status(201).json({ success: "Recipe added successfully" });
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const {
      title,
      image,
      description,
      calories,
      cookingTime,
      ingredients,
      instructions,
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      !calories ||
      !cookingTime ||
      !ingredients.length ||
      !instructions.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }

    const foundRecipe = await Recipe.findById(req.params.id);
    if (!foundRecipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (foundRecipe.author !== req.user)
      return res.status(401).json({ message: "Unauthorized" });

    foundRecipe.title = title;
    foundRecipe.description = description;
    foundRecipe.image = image;
    foundRecipe.calories = calories;
    foundRecipe.ingredients = ingredients;
    foundRecipe.cookingTime = cookingTime;
    foundRecipe.instructions = instructions;

    const updatedRecipe = await foundRecipe.save();
    res.status(201).json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

const rateRecipe = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const existingRating = recipe.ratings.find((rate) =>
      rate.user.equals(req.user)
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "User has already rated this recipe" });
    }

    recipe.ratings.push({ user: req.user, rating: rating });
    await recipe.save();

    res.status(201).json({ message: "Rating added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const foundRecipe = await Recipe.findById(req.params.id);
    if (!foundRecipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (foundRecipe.author !== req.user)
      return res.status(401).json({ message: "Unauthorized" });

    await foundRecipe.deleteOne({ _id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required." });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    recipe.comments.push({ user: req.user, comment });
    await recipe.save();

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { recipeId, commentId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const commentIndex = recipe.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found." });
    }

    recipe.comments.splice(commentIndex, 1);
    await recipe.save();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const toggleFavoriteRecipe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipeIndex = user.favorites.indexOf(req.params.id);
    if (recipeIndex === -1) {
      user.favorites.push(req.params.id);
    } else {
      user.favorites.splice(recipeIndex, 1);
    }

    await user.save();

    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          roles: roles,
          favorites: user.favorites,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  getRecipe,
  getAllBlogs,
  addRecipe,
  updateRecipe,
  rateRecipe,
  deleteRecipe,
  addComment,
  deleteComment,
  toggleFavoriteRecipe,
};