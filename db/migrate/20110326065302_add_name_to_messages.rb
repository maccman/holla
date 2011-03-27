class AddNameToMessages < ActiveRecord::Migration
  def self.up
    add_column :messages, :name, :string
  end

  def self.down
    remove_column :messages, :name
  end
end