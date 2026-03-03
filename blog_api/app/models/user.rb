class User < ApplicationRecord
  has_secure_password

  has_many :articles, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :photos, dependent: :destroy

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, allow_nil: true

  before_create :generate_jti

  normalizes :email, with: -> e { e.strip.downcase }

  private

  def generate_jti
    self.jti = SecureRandom.uuid
  end
end
