class AddChannelIdToMessages < ActiveRecord::Migration
  def self.up
    add_column :messages, :channel_id, :string, :null => false
  end

  def self.down
    remove_column :messages, :channel_id
  end
end