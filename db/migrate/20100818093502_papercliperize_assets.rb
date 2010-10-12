class PapercliperizeAssets < ActiveRecord::Migration
  def self.up
    drop_table :assets
    create_table :assets, :force => true do |t|
      t.string :name
      t.string   :data_file_name
      t.string   :data_content_type
      t.integer  :data_file_size
      t.datetime :data_updated_at
      t.string   :preview_file_name
      t.string   :preview_content_type
      t.integer  :preview_file_size
      t.datetime :preview_updated_at
      t.timestamps
    end
  end

  def self.down
  end
end