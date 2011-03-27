class AddGuids < ActiveRecord::Migration
  def self.up
    change_column :channels, :id, :string
    change_column :messages, :id, :string
  end

  def self.down
    change_column :messages, :id, :string
    change_column :channels, :id, :string
  end
end