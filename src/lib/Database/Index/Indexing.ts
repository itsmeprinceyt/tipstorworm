export const createIndexStatements: string[] = [
  // Users table indexes
  "CREATE INDEX idx_users_username ON users(username)",
  "CREATE INDEX idx_users_visibility ON users(visibility)",
  "CREATE INDEX idx_users_is_admin ON users(is_admin)",
  "CREATE INDEX idx_users_is_mod ON users(is_mod)",
  "CREATE INDEX idx_users_is_banned ON users(is_banned)",
  "CREATE INDEX idx_users_created_at ON users(created_at)",
  "CREATE INDEX idx_users_updated_at ON users(updated_at)",

  // Invite tokens table indexes
  "CREATE INDEX idx_invite_tokens_active ON invite_tokens(active)",
  "CREATE INDEX idx_invite_tokens_expires_at ON invite_tokens(expires_at)",

  // Categories table indexes
  "CREATE INDEX idx_categories_name ON categories(name)",
  "CREATE INDEX idx_categories_created_at ON categories(created_at)",
  "CREATE INDEX idx_categories_updated_at ON categories(updated_at)",

  // Posts table indexes
  "CREATE INDEX idx_posts_short_description ON posts(short_description)",
  "CREATE INDEX idx_posts_post_status ON posts(post_status)",
  "CREATE INDEX idx_posts_featured ON posts(featured)",
  "CREATE INDEX idx_posts_created_at ON posts(created_at)",
  "CREATE INDEX idx_posts_updated_at ON posts(updated_at)",

  // Reactions table indexes
  "CREATE INDEX idx_reactions_user_id ON reactions(user_id)",
  "CREATE INDEX idx_reactions_type ON reactions(type)",
  "CREATE INDEX idx_reactions_created_at ON reactions(created_at)",

  // Audit logs table indexes
  "CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type)",
  "CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id)",
  "CREATE INDEX idx_audit_logs_target_user_id ON audit_logs(target_user_id)",
  "CREATE INDEX idx_audit_logs_performed_at ON audit_logs(performed_at)",
  "CREATE INDEX idx_audit_logs_actor_email ON audit_logs(actor_email)",

  // Reviews table indexes
  "CREATE INDEX idx_reviews_user_id ON reviews(user_id)",
  "CREATE INDEX idx_reviews_rating ON reviews(rating)",
  "CREATE INDEX idx_reviews_status ON reviews(status)",
  "CREATE INDEX idx_reviews_created_at ON reviews(created_at)",
  "CREATE INDEX idx_reviews_updated_at ON reviews(updated_at)",

  // Suggestions reports table indexes
  "CREATE INDEX idx_suggestions_status ON suggestions_reports(status)",
  "CREATE INDEX idx_suggestions_type ON suggestions_reports(type)",
  "CREATE INDEX idx_suggestions_priority ON suggestions_reports(priority)",
  "CREATE INDEX idx_suggestions_status_priority ON suggestions_reports(status, priority)",
  "CREATE INDEX idx_suggestions_type_status ON suggestions_reports(type, status)",
  "CREATE INDEX idx_suggestions_created_at ON suggestions_reports(created_at)",
  "CREATE INDEX idx_suggestions_updated_at ON suggestions_reports(updated_at)",
  "CREATE INDEX idx_suggestions_status_created ON suggestions_reports(status, created_at)",
  "CREATE INDEX idx_suggestions_vote_count ON suggestions_reports(vote_count)",
];

export const dropIndexStatements: string[] = [
  // Users table indexes
  "DROP INDEX idx_users_username ON users",
  "DROP INDEX idx_users_visibility ON users",
  "DROP INDEX idx_users_is_admin ON users",
  "DROP INDEX idx_users_is_mod ON users",
  "DROP INDEX idx_users_is_banned ON users",
  "DROP INDEX idx_users_created_at ON users",
  "DROP INDEX idx_users_updated_at ON users",

  // Invite tokens table indexes
  "DROP INDEX idx_invite_tokens_active ON invite_tokens",
  "DROP INDEX idx_invite_tokens_expires_at ON invite_tokens",

  // Categories table indexes
  "DROP INDEX idx_categories_name ON categories",
  "DROP INDEX idx_categories_created_at ON categories",
  "DROP INDEX idx_categories_updated_at ON categories",

  // Posts table indexes
  "DROP INDEX idx_posts_short_description ON posts",
  "DROP INDEX idx_posts_post_status ON posts",
  "DROP INDEX idx_posts_featured ON posts",
  "DROP INDEX idx_posts_created_at ON posts",
  "DROP INDEX idx_posts_updated_at ON posts",

  // Reactions table indexes
  "DROP INDEX idx_reactions_user_id ON reactions",
  "DROP INDEX idx_reactions_type ON reactions",
  "DROP INDEX idx_reactions_created_at ON reactions",

  // Audit logs table indexes
  "DROP INDEX idx_audit_logs_action_type ON audit_logs",
  "DROP INDEX idx_audit_logs_actor_user_id ON audit_logs",
  "DROP INDEX idx_audit_logs_target_user_id ON audit_logs",
  "DROP INDEX idx_audit_logs_performed_at ON audit_logs",
  "DROP INDEX idx_audit_logs_actor_email ON audit_logs",

  // Reviews table indexes
  "DROP INDEX idx_reviews_user_id ON reviews",
  "DROP INDEX idx_reviews_rating ON reviews",
  "DROP INDEX idx_reviews_status ON reviews",
  "DROP INDEX idx_reviews_created_at ON reviews",
  "DROP INDEX idx_reviews_updated_at ON reviews",

  // Suggestions reports table indexes
  "DROP INDEX idx_suggestions_status ON suggestions_reports",
  "DROP INDEX idx_suggestions_type ON suggestions_reports",
  "DROP INDEX idx_suggestions_priority ON suggestions_reports",
  "DROP INDEX idx_suggestions_status_priority ON suggestions_reports",
  "DROP INDEX idx_suggestions_type_status ON suggestions_reports",
  "DROP INDEX idx_suggestions_created_at ON suggestions_reports",
  "DROP INDEX idx_suggestions_updated_at ON suggestions_reports",
  "DROP INDEX idx_suggestions_status_created ON suggestions_reports",
  "DROP INDEX idx_suggestions_vote_count ON suggestions_reports",
];
