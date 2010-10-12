class AddCreatorIdToAssets < ActiveRecord::Migration
  def self.up
    add_column :assets, :creator_id, :string
  end

  def self.down
    remove_column :assets, :creator_id
  end
end