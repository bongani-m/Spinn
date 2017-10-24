class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :username, null: false
      t.string :password_digest
      t.string :session_token

      t.timestamps
    end

    add_index :users, :session_token
    add_index :users, :username, unique: true
  end
end
