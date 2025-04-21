import { apiSlice } from "../../redux/apiSlice";

export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipe: builder.query({
      query: (recipeId) => `/recipe/${recipeId}`,
      providesTags: ["recipes"],
      transformResponse: (response) => response.message ? { message: response.message } : response,
    }),
    getRecipes: builder.query({
      query: () => "/recipe",
      providesTags: ["recipes"],
      transformResponse: (response) => response.message ? { message: response.message } : response,
    }),
    getBlogs: builder.query({
      query: () => "/blog/blogs", // Adjusted to match a potential blogs route (update if different)
      providesTags: ["blogs"],
      transformResponse: (response) => response.message ? { message: response.message } : response,
    }),
    addRecipe: builder.mutation({
      query: (recipeData) => ({
        url: "/recipe",
        method: "POST",
        body: { ...recipeData },
      }),
      invalidatesTags: ["recipes"],
    }),
    updateRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, ...recipeData } = args;
        return {
          url: `/recipe/${recipeId}`,
          method: "PUT",
          body: { ...recipeData },
        };
      },
      invalidatesTags: ["recipes"],
    }),
    rateRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, rating } = args;
        return {
          url: `/recipe/rate/${recipeId}`,
          method: "PUT",
          body: { rating },
        };
      },
      invalidatesTags: ["recipes"],
    }),
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/recipe/${recipeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["recipes"],
    }),
    commentRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, comment } = args;
        return {
          url: `/recipe/comment/${recipeId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: ["recipes"],
    }),
    deleteCommentRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, commentId } = args;
        return {
          url: `/recipe/comment/${recipeId}/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["recipes"],
    }),
    toggleFavorite: builder.mutation({
      query: ({ recipeId }) => ({
        url: `/recipe/favorite/${recipeId}`,
        method: "PUT",
      }),
      invalidatesTags: ["recipes"],
    }),
  }),
});

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