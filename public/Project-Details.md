# 🚀 Project API & Frontend Documentation  

## ✅ Status Legend
- ❌    - Not yet implemented  
- ⏳    - Implemented but needs finalization  
- 🌱    - Completed but requires future changes (see `Things-to-remember.md`)  
- ✅    - Completed & Finalized 
- ✅✅  - Updated route to update database changes
- 🔄    - Need refactoring
- 📃    - Documentation Pending
- 🔴    - Audit log enabled
- 🔴👈  - Audit log checked up until here
- 🟠    - Page locking enabled
- 😖    - To be removed in the future
- ⬜    - Reddis connection


# Backend

## 1. Authentication & User Management

**Public APIs**
1. 📃 `POST` `/auth/[...nextauth]` - Next-auth 🔴
2. 📃 `GET` `/public/heartbeat` - Heartbeat function to check MySQL & Redis Connection ⬜
3. 📃 `POST` `/public/single-setting` - Get all global settings
4. 📃 `POST` `/public/invite-code-raffle` - Give a token every 24 hours & new token if current one is used

**User Profile APIs**
1. 📃 `GET` `/user/[profile]` - Get current user profile
2. 📃 `PUT` `/user/[profile/update-me` - Update current user profile
3. ❌ `GET` `/dashboard/user/:userId` - Get public user profile
4. ❌ `GET` `/dashboard/user/:userId/posts` - Get user's posts
5. ❌ `GET` `/dashboard/user/:userId/fav` - Get user's favourite posts
6. ❌ `GET` `/dashboard/user/:userId/heart` - Get user's hearted posts
7. ❌ `GET` `/dashboard/user/check-username/:username` - Check username availability
8. ❌ `PUT` `/dashboard/user/toggle-profile-visibility` - Toggle profile public status

**Admin User Management**
1. ❌ `GET` `/admin/users` - List all users (with pagination/filters)
2. ❌ `GET` `/admin/users/:userId` - Get user details (admin)
3. ❌ `PUT` `/admin/users/:userId/update` - Update user (admin)
4. ❌ `POST` `/admin/users/:userId/ban` - Ban user
5. ❌ `POST` `/admin/users/:userId/unban` - Unban user
6. ❌ `POST` `/admin/users/:userId/promote-admin` - Promote to admin
7. ❌ `POST` `/admin/users/:userId/demote-admin` - Demote from admin
8. ❌ `POST` `/admin/users/:userId/promote-mod` - Promote to moderator
9. ❌ `POST` `/admin/users/:userId/demote-mod` - Demote from moderator
10. ❌ `DELETE` `/admin/users/:userId/delete` - Soft delete user
11. 📃 `GET` `/admin/routes-access` – Get all routes access & status ⬜  
12. 📃 `PATCH` `/admin/routes-access/:key` – Toggle route access
13. 📃 `POST` `/admin/routes-access/add/:key` – Add a route to DB
14. 📃 `PATCH` `/admin/routes-access/update/:key` – Update route in DB
15. 📃 `DELETE` `/admin/routes-access/remove/:key` – Remove route from DB
16. 📃 `GET` `/admin/redis-manager` - Get Redis Database
17. 📃 `POST` `/admin/redis-manager` - Delete a single cache
18. 📃 `DELETE` `/admin/redis-manager` Flush Redis DB

## 2. Posts Management

**Public Post APIs**
1. ❌ `GET` `/:categoriesId/posts` - List all categories posts (with pagination/filters)
2. ❌ `GET` `/:categoriesId/posts/:slug` - Get single post by slug
3. ❌ `GET` `/posts/featured` - Get featured posts ( with highest hearts )
4. ❌ `GET` `/posts/user/:userId` - Get posts created by that user

**Authenticated Post APIs**
1. ❌ `POST` `/dashboard/posts` - Create new post
2. ❌ `PUT` `/posts/:postId` - Update post
3. ❌ `DELETE` `/posts/:postId` - Delete post
4. ❌ `POST` `/posts/:postId/feature` - Feature a post (admin)
5. ❌ `POST` `/posts/:postId/unfeature` - Unfeature a post (admin)

**Post Media Management**
1. ❌ `POST` `/posts/:postId/screenshots` - Upload screenshots
2. ❌ `DELETE` `/posts/:postId/screenshots/:screenshotId` - Delete screenshot

## 🏷️ 3. Categories Management

**Public Category APIs**
1. ❌ `GET` `/categories` - List all categories
2. ❌ `GET` `/categories/:categoryId` - Get category details

**Admin Category APIs**
1. 📃 `GET` `/admin/category-manager/` - Get all categories & creator data
2. 📃 `POST` `/admin/category-manager/create` - Create category
3. ❌ `PUT` `/admin/categories/:categoryId` - Update category name
4. ❌ `DELETE` `/admin/categories/:categoryId` - Delete category

## 4. Reactions System

1. ❌ `POST` `/posts/:postId/reactions` - Add reaction to post
2. ❌ `DELETE` `/posts/:postId/reactions` - Remove reaction from post

## 5. Invite System

1. ⏳ `POST` `/api/admin/invite-code-manager/create` - Create invite token (admin)
2. ⏳ `GET` `/api/admin/invite-code-manager` - List all invite tokens (admin)
3. ❌ `POST` `/admin/invites/deactivate/:token` - Deactivate invite token (admin)
4. ⏳ `GET` `/api/public/invite-code-validate` - Validate invite token and return expiry time
5. ❌ `GET` `/users/me/invites` - Get user's created invites

## 6. Settings & System

**Audit Logs**
1. 📃 `POST` `/admin/audit-logs` - Get audit logs (admin)

## 7. Analytics & Dashboard
1. ❌ `GET` `/admin/dashboard` - Admin dashboard analytics
2. ❌ `GET` `/admin/analytics/posts` - Post analytics (admin)
3. ❌ `GET` `/admin/analytics/users` - User analytics (admin)
4. ❌ `GET` `/admin/analytics/categories` - Category analytics (admin)

## 8. Search & Discovery
1. ❌ `GET` `/search/posts` - Search posts
2. ❌ `GET` `/search/users` - Search users
3. ❌ `GET` `/discover` - Discover content (featured, trending, etc.)

## 9. Suggestions & Reports System

**Public Suggestion APIs**
1. ❌ `POST` `/suggestions` - Submit new suggestion/report (anonymous or authenticated)
2. ❌ `GET` `/suggestions/public` - Get public suggestions (feature requests, etc.)

**User Suggestion Management**
1. ❌ `GET` `/admin/dashboard/user/suggestions` - Get user's submitted suggestions
2. ❌ `PUT` `/admin/dashboard/user/suggestions/:suggestionId` - Update user's suggestion
3. ❌ `POST` `/admin/dashboard/user/suggestions/:suggestionId/contact-consent` - Update suggestion

**Admin Suggestion Management**
1. ❌ `GET` `/admin/suggestions` - List all suggestions (with filters/pagination)
2. ❌ `GET` `/admin/suggestions/:suggestionId` - Get suggestion details (admin view)
3. ❌ `POST` `/admin/suggestions/:suggestionId/assign` - Assign suggestion to admin/mod
4. ❌ `POST` `/admin/suggestions/:suggestionId/unassign` - Unassign suggestion
5. ❌ `PUT` `/admin/suggestions/:suggestionId/priority` - Update priority
6. ❌ `POST` `/admin/suggestions/:suggestionId/close` - Close suggestion
7. ❌ `POST` `/admin/suggestions/:suggestionId/reopen` - Reopen suggestion
8. ❌ `DELETE` `/admin/suggestions/:suggestionId` - Delete suggestion (admin)

**Suggestion Voting & Engagement (Optional)**
1. ❌ `POST` `/suggestions/:suggestionId/vote` - Vote on public suggestions
2. ❌ `DELETE` `/suggestions/:suggestionId/vote` - Remove vote
3. ❌ `GET` `/suggestions/:suggestionId/votes` - Get vote count