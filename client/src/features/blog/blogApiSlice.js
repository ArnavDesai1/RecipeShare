import { apiSlice } from "../../redux/apiSlice";

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlog: builder.query({
      query: (blogId) => `/blog/${blogId}`, // This might not apply to NewsAPI; consider removing if unused
      providesTags: ["blogs"],
    }),
    getBlogs: builder.query({
      query: () => "/blog/blogs", // Updated to /blog/blogs to match server route
      providesTags: ["blogs"],
    }),
    addBlog: builder.mutation({
      query: (blogData) => ({
        url: "/blog",
        method: "POST",
        body: { ...blogData },
      }),
      invalidatesTags: ["blogs"],
    }),
    updateBlog: builder.mutation({
      query: (args) => {
        const { blogId, ...blogData } = args;
        return {
          url: `/blog/${blogId}`,
          method: "PUT",
          body: { ...blogData },
        };
      },
      invalidatesTags: ["blogs"],
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/blog/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogs"],
    }),
    commentBlog: builder.mutation({
      query: (args) => {
        const { blogId, comment } = args;
        return {
          url: `/blog/comment/${blogId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: ["blogs"],
    }),
    deleteCommentBlog: builder.mutation({
      query: (args) => {
        const { blogId, commentId } = args;
        return {
          url: `/blog/comment/${blogId}/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useGetBlogQuery,
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useCommentBlogMutation,
  useDeleteCommentBlogMutation,
} = blogApiSlice;