class MakeIdsStrings < ActiveRecord::Migration
  def self.up
    change_column :channels, :id, :string
    change_column :users, :id, :string
  end

  def self.down
    change_column :users, :id, :integer
    change_column :channels, :id, :integer
  end
end