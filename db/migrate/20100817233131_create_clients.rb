class CreateClients < ActiveRecord::Migration
  def self.up
    create_table :clients, :force => true do |t|
      t.string  :user_id
      t.integer :access_key_id
      t.timestamps
    end
  end

  def self.down
    drop_table :clients
  end
end