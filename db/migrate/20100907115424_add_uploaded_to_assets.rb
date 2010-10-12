class AddUploadedToAssets < ActiveRecord::Migration
  def self.up
    add_column :assets, :uploaded, :boolean
  end

  def self.down
    remove_column :assets, :uploaded
  end
end