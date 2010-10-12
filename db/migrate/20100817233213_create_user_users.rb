class CreateUserUsers < ActiveRecord::Migration
  def self.up
    create_table :users, :force => true do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :handle
      t.string   "crypted_password"
      t.string   "password_salt"
      t.string   "persistence_token"
      t.datetime "current_login_at"
      t.string   "current_login_ip"
      t.string   "avatar_file_name"
      t.string   "avatar_content_type"
      t.integer  "avatar_file_size"
      t.datetime "avatar_updated_at"
      t.string   "single_access_token"
      t.string   "perishable_token"
      t.integer  "active_token_id"
      t.string   "oauth_token"
      t.string   "oauth_secret"
      t.boolean  "oauth"
      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end