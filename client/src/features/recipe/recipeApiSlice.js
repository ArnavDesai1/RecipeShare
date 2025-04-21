import { apiSlice } from "../../redux/apiSlice";

// Define the API slice with updated endpoints
export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch a specific recipe by ID
    getRecipe: builder.query({
      query: (recipeId) => `/api/recipe/${recipeId}`, // Updated to include /api prefix
      providesTags: ["recipes"],
      transformResponse: (response) => response.message ? { message: response.message } : response,
    }),
    // Fetch all recipes
    getRecipes: builder.query({
      query: () => "/api/recipe", // Updated to include /api prefix
      providesTags: ["recipes"],
      transformResponse: (response) => response.message ? { message: response.message } : response,
    }),
    // Fetch all blogs
    getBlogs: builder.query({
      query: () => "/api/blog/blogs", // Matches backend route
      providesTags: ["blogs"],
      transformResponse: (response) => response.message ? { message: response.message } : response,
    }),
    // Add a new recipe
    addRecipe: builder.mutation({
      query: (recipeData) => ({
        url: "/api/recipe", // Updated to include /api prefix
        method: "POST",
        body: { ...recipeData },
      }),
      invalidatesTags: ["recipes"],
    }),
    // Update an existing recipe
    updateRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, ...recipeData } = args;
        return {
          url: `/api/recipe/${recipeId}`, // Updated to include /api prefix
          method: "PUT",
          body: { ...recipeData },
        };
      },
      invalidatesTags: ["recipes"],
    }),
    // Rate a recipe
    rateRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, rating } = args;
        return {
          url: `/api/recipe/rate/${recipeId}`, // Updated to include /api prefix
          method: "PUT",
          body: { rating },
        };
      },
      invalidatesTags: ["recipes"],
    }),
    // Delete a recipe
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/api/recipe/${recipeId}`, // Updated to include /api prefix
        method: "DELETE",
      }),
      invalidatesTags: ["recipes"],
    }),
    // Add a comment to a recipe
    commentRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, comment } = args;
        return {
          url: `/api/recipe/comment/${recipeId}`, // Updated to include /api prefix
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: ["recipes"],
    }),
    // Delete a comment from a recipe
    deleteCommentRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, commentId } = args;
        return {
          url: `/api/recipe/comment/${recipeId}/${commentId}`, // Updated to include /api prefix
          method: "DELETE",
        };
      },
      invalidatesTags: ["recipes"],
    }),
    // Toggle favorite status for a recipe
    toggleFavorite: builder.mutation({
      query: ({ recipeId }) => ({
        url: `/api/recipe/favorite/${recipeId}`, // Updated to include /api prefix
        method: "PUT",
      }),
      invalidatesTags: ["recipes"],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetRecipeQuery,
  useGetRecipesQuery,
  useGetBlogsQuery,
  useAddRecipeMutation,
  useUpdateRecipeMutation,
  useRateRecipeMutation,
  useDeleteRecipeMutation,
  useCommentRecipeMutation,
  useDeleteCommentRecipeMutation,
  useToggleFavoriteMutation,
} = recipeApiSlice;