# 🚀 Project API & Frontend Documentation  

## ✅ Status Legend
- ❌    - Not yet implemented  
- ⏳    - Implemented but needs finalization  
- 🌱    - Completed but requires future changes (see `Things-to-remember.md`)  
- ✅    - Completed & Finalized 
- ✅✅  - Updated route to update database changes
- 🔄    - Need refactoring
- 📃    - Documentation Pending
- 🔴    - Audit log needed
- 🔴👈  - Audit log checked up until here
- 🟠    - Page locking enabled
- 😖    - To be removed in the future
- ⬜    - Reddis Added


# Backend

#### 🔑 1. Authentication & User Management

---

**Public APIs**
1. ⏳ `POST` `/auth/register - User registration with invite token

**User Profile APIs**
1. ❌ `GET` `/dashboard/user/me` - Get current user profile
2. ❌ `PUT` `/dashboard/user/update-me` - Update current user profile
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
11. ❌ `GET` `/admin/routes-access` – Get all routes access & status  
12. ❌ `PATCH` `/admin/routes-access/:key` – Toggle route access
13. ❌ `POST` `/admin/routes-access/add/:key` – Add a route to DB
14. ❌ `PATCH` `/admin/routes-access/update/:key` – Update route in DB
15. ❌ `DELETE` `admin/routes-access/remove/:key` – Remove route from DB

**📝 2. Posts Management**

--- 

**Public Post APIs**
1. ❌ `GET` `/posts/categories` - List all categories posts (with pagination/filters)
2. ❌ `GET` `/posts/categories/:slug` - Get single post by slug
3. ❌ `GET` `/posts/featured` - Get featured posts ( with highest hearts )
4. ❌ `GET` `/posts/user/:userId` - Get posts created by that user
TODO
**Authenticated Post APIs**
1. `POST` `/dashboard/posts` - Create new post
2. `PUT` `/posts/:postId` - Update post
3. `DELETE` `/posts/:postId` - Delete post
6. `POST` /posts/:postId/feature - Feature a post (admin)
7. `POST` /posts/:postId/unfeature - Unfeature a post (admin)

Post Media Management
POST /posts/:postId/icon - Upload post icon

DELETE /posts/:postId/icon - Delete post icon

POST /posts/:postId/screenshots - Upload screenshots

DELETE /posts/:postId/screenshots/:screenshotId - Delete screenshot

🏷️ 3. Categories Management
Public Category APIs
GET /categories - List all categories

GET /categories/:categoryId - Get category details

GET /categories/:categoryId/posts - Get posts by category

Admin Category APIs
POST /admin/categories - Create category

PUT /admin/categories/:categoryId - Update category

DELETE /admin/categories/:categoryId - Delete category

Post-Category Relationships
POST /posts/:postId/categories - Add categories to post

DELETE /posts/:postId/categories/:categoryId - Remove category from post

GET /posts/:postId/categories - Get post's categories

❤️ 4. Reactions System
POST /posts/:postId/reactions - Add reaction to post

DELETE /posts/:postId/reactions - Remove reaction from post

GET /posts/:postId/reactions - Get post reactions

GET /users/me/reactions - Get user's reactions

GET /users/me/favorites - Get user's favorite posts

🔐 5. Invite System
POST /admin/invites - Create invite token (admin)

GET /admin/invites - List all invite tokens (admin)

POST /admin/invites/deactivate/:token - Deactivate invite token (admin)

GET /invites/validate/:token - Validate invite token

GET /users/me/invites - Get user's created invites

⚙️ 6. Settings & System
Global Settings
GET /settings - Get all global settings

GET /settings/:key - Get specific setting

PUT /admin/settings/:key - Update global setting (admin)

Audit Logs
GET /admin/audit-logs - Get audit logs (admin)

GET /admin/audit-logs/user/:userId - Get user's audit logs (admin)

GET /admin/audit-logs/action/:actionType - Get logs by action type (admin)

📊 7. Analytics & Dashboard
GET /admin/dashboard - Admin dashboard analytics

GET /users/me/dashboard - User dashboard stats

GET /admin/analytics/posts - Post analytics (admin)

GET /admin/analytics/users - User analytics (admin)

GET /admin/analytics/categories - Category analytics (admin)

🔍 8. Search & Discovery
GET /search/posts - Search posts

GET /search/users - Search users

GET /discover - Discover content (featured, trending, etc.)

GET /tags/:tag/posts - Get posts by tag (from metadata)

🗂️ 9. Utility APIs
POST /upload/signed-url - Generate signed upload URL

GET /health - System health check

POST /admin/redis-flush - Flush Redis cache (admin)

GET /sitemap/posts - Posts sitemap

GET /sitemap/users - Users sitemap