class Channel < ActiveRecord::Migration
  def self.up
    create_table :channels, :force => true do |t|
      t.string :name
      t.string :creator_id
      t.timestamps
    end
  end

  def self.down
    drop_table :channels
  end
end