class CreateUserChannel < ActiveRecord::Migration
  def self.up
    create_table :user_channels, :force => true do |t|
      t.string :channel_id
      t.string :user_id
      t.timestamps
    end
  end

  def self.down
    drop_table :user_channels
  end
end