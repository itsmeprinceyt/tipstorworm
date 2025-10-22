CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(12) UNIQUE NOT NULL,

    name VARCHAR(255) NOT NULL,
    username VARCHAR(20) DEFAULT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,

    image VARCHAR(500) DEFAULT NULL,
    cover_image VARCHAR(500) DEFAULT NULL,
    bio VARCHAR(160) DEFAULT NULL,
    website VARCHAR(100) DEFAULT NULL,

    visibility ENUM('public','private') NOT NULL DEFAULT 'public',
    is_admin BOOLEAN DEFAULT FALSE,
    is_mod BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,

    created_at VARCHAR(30) DEFAULT NULL,
    updated_at VARCHAR(30) DEFAULT NULL
);


CREATE TABLE IF NOT EXISTS invite_tokens (
  token CHAR(36) NOT NULL PRIMARY KEY,
  created_by CHAR(36) DEFAULT NULL,

  uses INT NOT NULL DEFAULT 0,
  max_uses INT NOT NULL DEFAULT 1,
  active TINYINT(1) NOT NULL DEFAULT 1,

  created_at VARCHAR(30) DEFAULT NULL,
  expires_at VARCHAR(30) DEFAULT NULL,

  CONSTRAINT fk_invite_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS master_invite_token (
  token CHAR(36) NOT NULL PRIMARY KEY,
  uses INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  created_by CHAR(36) DEFAULT NULL,
  created_at VARCHAR(30) DEFAULT NULL,
  updated_at VARCHAR(30) DEFAULT NULL,

  CONSTRAINT fk_category_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS posts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  content LONGTEXT DEFAULT NULL,

  icon VARCHAR(1000) DEFAULT NULL,
  icon_id VARCHAR(100) DEFAULT NULL,
  screenshots JSON NOT NULL DEFAULT (JSON_ARRAY()),

  created_by CHAR(36) DEFAULT NULL,
  created_at VARCHAR(30) DEFAULT NULL,
  updated_at VARCHAR(30) DEFAULT NULL,

  post_status ENUM('public','private') NOT NULL DEFAULT 'public',
  featured TINYINT(1) NOT NULL DEFAULT 0,

  metadata JSON DEFAULT NULL,

  CONSTRAINT fk_posts_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS post_categories (
  post_id CHAR(36) NOT NULL,
  category_id CHAR(36) NOT NULL,
  PRIMARY KEY (post_id, category_id),
  CONSTRAINT fk_pc_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS reactions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  post_id CHAR(36) NOT NULL,
  type ENUM('heart','favorite') NOT NULL,
  created_at VARCHAR(30) DEFAULT NULL,

  CONSTRAINT ux_reaction_user_post_type UNIQUE (user_id, post_id, type),
  CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reactions_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS global_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id CHAR(36) NOT NULL PRIMARY KEY,
    action_type ENUM(
        'user_signup',
        'user_update',
        'user_ban',
        'user_unban',
        'admin_promote',
        'admin_demote',
        'mod_promote', 
        'mod_demote',
        'post_create',
        'post_update',
        'post_delete',
        'post_feature',
        'post_unfeature',
        'category_create',
        'category_update',
        'category_delete',
        'reaction_create',
        'reaction_delete',
        'invite_token_create',
        'invite_token_deactivate',
        'suggestion_create',
        'suggestion_update',
        'suggestion_delete',
        'suggestion_status_change',
        'settings_update',
        'system'
    ) NOT NULL,

    actor_user_id CHAR(36),
    target_user_id CHAR(36),

    actor_email VARCHAR(255),
    actor_name VARCHAR(255),

    description TEXT,
    meta JSON,

    performed_at VARCHAR(30) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(250) NULL,
    status ENUM('active', 'deleted', 'flagged') DEFAULT 'active',

    created_at VARCHAR(30) DEFAULT NULL,
    updated_at VARCHAR(30) DEFAULT NULL,
    
    CONSTRAINT ux_review_user_post UNIQUE (user_id, post_id),
    
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS suggestions_reports (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) DEFAULT NULL,
    
    type ENUM('suggestion', 'bug_report', 'feature_request', 'content_report', 'other') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    related_post_id CHAR(36) DEFAULT NULL,
    related_user_id CHAR(36) DEFAULT NULL,
    
    vote_count INT NOT NULL DEFAULT 0,
    status ENUM('open', 'in_review', 'planned', 'in_progress', 'completed', 'rejected', 'duplicate') NOT NULL DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    
    admin_notes TEXT DEFAULT NULL,
    assigned_to CHAR(36) DEFAULT NULL,
    
    allow_contact BOOLEAN DEFAULT FALSE,
    contact_email VARCHAR(255) DEFAULT NULL,
    
    metadata JSON DEFAULT NULL,
    
    created_at VARCHAR(30) DEFAULT NULL,
    updated_at VARCHAR(30) DEFAULT NULL,
    closed_at VARCHAR(30) DEFAULT NULL,
    
    CONSTRAINT fk_suggestions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_suggestions_post FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE SET NULL,
    CONSTRAINT fk_suggestions_related_user FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_suggestions_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);