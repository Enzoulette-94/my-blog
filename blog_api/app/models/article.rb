class Article < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy

  validates :title, presence: true
  validates :content, presence: true

  scope :public_articles, -> { where(private: false) }
  scope :visible_to, ->(user) {
    if user
      where("private = false OR user_id = ?", user.id)
    else
      public_articles
    end
  }
end
