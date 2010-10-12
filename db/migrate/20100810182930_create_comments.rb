class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|
      t.text   :body
      t.string :klass
      t.string :klass_id
      t.timestamps
    end
    add_index :comments, :klass_id
    add_index :comments, :klass
  end

  def self.down
    remove_index :comments, :klass
    remove_index :comments, :klass_id
    drop_table :comments
  end
end