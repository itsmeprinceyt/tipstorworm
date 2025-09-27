-- Tipstor Worm Database Schema
-- Compatible with NextAuth.js for authentication

-- -----------------------------------------------------------------------------
-- NEXTAUTH.JS CORE TABLES
-- These tables are required for NextAuth.js to handle user authentication,
-- sessions, and OAuth account linking.
-- -----------------------------------------------------------------------------

-- `users` table: Stores the core user profile.
-- A user can be created through credentials (email/password) or an OAuth provider.
CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191),
  `email` VARCHAR(191) UNIQUE,
  `emailVerified` TIMESTAMP(3),
  `image` VARCHAR(191),
  `isAdmin` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
);

-- `accounts` table: Links OAuth provider accounts to a user in the `users` table.
-- For example, if a user signs in with Google, a record is created here linking
-- their `users` record to their Google account ID.
CREATE TABLE `accounts` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL,
  `providerAccountId` VARCHAR(191) NOT NULL,
  `refresh_token` TEXT,
  `access_token` TEXT,
  `expires_at` INT,
  `token_type` VARCHAR(191),
  `scope` VARCHAR(191),
  `id_token` TEXT,
  `session_state` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_provider_providerAccountId_key` (`provider`, `providerAccountId`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- `sessions` table: Stores user session information.
-- Used by NextAuth to manage who is currently logged in.
CREATE TABLE `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `sessionToken` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_sessionToken_key` (`sessionToken`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- `verification_tokens` table: Used for passwordless email sign-in.
-- Stores a temporary token that is sent to a user's email.
CREATE TABLE `verification_tokens` (
  `identifier` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,
  PRIMARY KEY (`identifier`, `token`)
);


-- -----------------------------------------------------------------------------
-- APPLICATION-SPECIFIC TABLES
-- These tables are for the core functionality of your Tipstor Worm application.
-- -----------------------------------------------------------------------------

-- `categories` table: Stores the different categories for posts.
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_key` (`name`)
);

-- `posts` table: Stores the main content submitted by users.
-- Renamed from 'Data' for clarity.
CREATE TABLE `posts` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `url` VARCHAR(2048) NOT NULL,
  `isApproved` BOOLEAN NOT NULL DEFAULT false,
  `userId` VARCHAR(191) NOT NULL,
  `categoryId` INT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

-- `likes` table: A pivot table to track which user liked which post.
-- This prevents a single user from liking the same post multiple times.
CREATE TABLE `likes` (
  `userId` VARCHAR(191) NOT NULL,
  `postId` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`userId`, `postId`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE
);

-- `invite_codes` table: To manage the secret sign-up codes shown in the UI diagram.
-- Admins can generate these codes to allow new users to register.
CREATE TABLE `invite_codes` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3),
  `isUsed` BOOLEAN NOT NULL DEFAULT false,
  `usedByUserId` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `invite_codes_code_key` (`code`),
  FOREIGN KEY (`usedByUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL
);