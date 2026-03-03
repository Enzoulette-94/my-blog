class CreateArticles < ActiveRecord::Migration[8.1]
  def change
    create_table :articles do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.references :user, null: false, foreign_key: true
      t.boolean :private, default: false, null: false

      t.timestamps
    end
  end
end
