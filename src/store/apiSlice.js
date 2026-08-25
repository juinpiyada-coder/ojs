import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCTION_API_URL } from '../utils/api';

const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  return PRODUCTION_API_URL;
};

export const ojsApi = createApi({
  reducerPath: 'ojsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Articles', 'Users', 'Volumes', 'Issues', 'Reviews', 'Announcements', 'Branding', 'Settings', 'AuditLogs'],
  keepUnusedDataFor: 300, // Cache for 5 minutes
  refetchOnMountOrArgChange: 30, // Don't refetch if mounted within 30s
  endpoints: (builder) => ({
    // --- ARTICLES ---
    getArticles: builder.query({
      query: (params) => {
        const qs = params ? new URLSearchParams(params).toString() : '';
        return `/articles${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ article_id }) => ({ type: 'Articles', id: article_id })),
              { type: 'Articles', id: 'LIST' },
            ]
          : [{ type: 'Articles', id: 'LIST' }],
    }),
    getArticleById: builder.query({
      query: (id) => `/articles?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Articles', id }],
    }),
    createArticle: builder.mutation({
      query: (body) => ({
        url: '/articles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    updateArticle: builder.mutation({
      query: (body) => ({
        url: '/articles',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { article_id }) => [
        { type: 'Articles', id: article_id },
        { type: 'Articles', id: 'LIST' },
      ],
    }),
    patchArticle: builder.mutation({
      query: (body) => ({
        url: '/articles',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { article_id }) => [
        { type: 'Articles', id: article_id },
        { type: 'Articles', id: 'LIST' },
      ],
    }),
    deleteArticle: builder.mutation({
      query: (params) => ({
        url: `/articles?id=${params.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),

    // --- USERS ---
    getUsers: builder.query({
      query: (params) => {
        const qs = params ? new URLSearchParams(params).toString() : '';
        return `/users${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ user_id }) => ({ type: 'Users', id: user_id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { user_id }) => [
        { type: 'Users', id: user_id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // --- VOLUMES & ISSUES ---
    getVolumes: builder.query({
      query: (params) => {
        const qs = params ? new URLSearchParams(params).toString() : '';
        return `/volumes${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Volumes', id: 'LIST' }],
    }),
    createVolume: builder.mutation({
      query: (body) => ({
        url: '/volumes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Volumes', id: 'LIST' }],
    }),
    updateVolume: builder.mutation({
      query: (body) => ({
        url: '/volumes',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Volumes', id: 'LIST' }],
    }),
    deleteVolume: builder.mutation({
      query: (id) => ({
        url: `/volumes?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Volumes', id: 'LIST' }],
    }),

    getIssues: builder.query({
      query: (params) => {
        const qs = params ? new URLSearchParams(params).toString() : '';
        return `/issues${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Issues', id: 'LIST' }],
    }),
    createIssue: builder.mutation({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Issues', id: 'LIST' }, { type: 'Volumes', id: 'LIST' }],
    }),
    updateIssue: builder.mutation({
      query: (body) => ({
        url: '/issues',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Issues', id: 'LIST' }, { type: 'Volumes', id: 'LIST' }],
    }),
    deleteIssue: builder.mutation({
      query: (id) => ({
        url: `/issues?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Issues', id: 'LIST' }, { type: 'Volumes', id: 'LIST' }],
    }),

    // --- REVIEWS ---
    getReviews: builder.query({
      query: (params) => {
        const qs = params ? new URLSearchParams(params).toString() : '';
        return `/reviews${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Reviews', id: 'LIST' }],
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Reviews', id: 'LIST' }, { type: 'Articles', id: 'LIST' }],
    }),
    patchReview: builder.mutation({
      query: (body) => ({
        url: '/reviews',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Reviews', id: 'LIST' }, { type: 'Articles', id: 'LIST' }],
    }),

    // --- ANNOUNCEMENTS ---
    getAnnouncements: builder.query({
      query: (params) => {
        const qs = params ? new URLSearchParams(params).toString() : '';
        return `/announcements${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Announcements', id: 'LIST' }],
    }),
    createAnnouncement: builder.mutation({
      query: (body) => ({
        url: '/announcements',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Announcements', id: 'LIST' }],
    }),
    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Announcements', id: 'LIST' }],
    }),

    // --- BRANDING & SETTINGS ---
    getBranding: builder.query({
      query: () => '/branding',
      providesTags: ['Branding'],
    }),
    updateBranding: builder.mutation({
      query: (body) => ({
        url: '/branding',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Branding'],
    }),

    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateSetting: builder.mutation({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // --- AUDIT LOGS ---
    getAuditLogs: builder.query({
      query: (params) => {
        const qs = params ? new URLSearchParams(params).toString() : '';
        return `/audit-logs${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['AuditLogs'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  usePatchArticleMutation,
  useDeleteArticleMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetVolumesQuery,
  useCreateVolumeMutation,
  useUpdateVolumeMutation,
  useDeleteVolumeMutation,
  useGetIssuesQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useGetReviewsQuery,
  useCreateReviewMutation,
  usePatchReviewMutation,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetBrandingQuery,
  useUpdateBrandingMutation,
  useGetSettingsQuery,
  useUpdateSettingMutation,
  useGetAuditLogsQuery,
} = ojsApi;
