class RemoveAttsFromAssets < ActiveRecord::Migration
  def self.up
    remove_column :assets, :name
    change_column :assets, :id, :string
  end

  def self.down
    change_column :assets, :id, :string
    add_column :assets, :name, :string
  end
end