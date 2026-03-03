require 'rails_helper'

RSpec.describe User, type: :model do
  describe "associations" do
    it { should have_many(:articles).dependent(:destroy) }
    it { should have_many(:comments).dependent(:destroy) }
    it { should have_many(:photos).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:user) }

    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }

    it "is invalid with a malformed email" do
      user = build(:user, email: "pas-un-email")
      expect(user).not_to be_valid
      expect(user.errors[:email]).to be_present
    end

    it "requires password of at least 6 characters" do
      user = build(:user, password: "abc", password_confirmation: "abc")
      expect(user).not_to be_valid
    end
  end

  describe "has_secure_password" do
    it "hashes the password on save" do
      user = create(:user, password: "mysecret", password_confirmation: "mysecret")
      expect(user.password_digest).not_to eq("mysecret")
    end

    it "authenticates with correct password" do
      user = create(:user, password: "mysecret", password_confirmation: "mysecret")
      expect(user.authenticate("mysecret")).to eq(user)
    end

    it "rejects wrong password" do
      user = create(:user, password: "mysecret", password_confirmation: "mysecret")
      expect(user.authenticate("wrong")).to be_falsey
    end
  end

  describe "email normalization" do
    it "downcases email before save" do
      user = create(:user, email: "TEST@EXAMPLE.COM")
      expect(user.reload.email).to eq("test@example.com")
    end

    it "strips whitespace from email" do
      user = create(:user, email: "  user@example.com  ")
      expect(user.reload.email).to eq("user@example.com")
    end
  end

  describe "jti generation" do
    it "generates a jti before creation" do
      user = create(:user)
      expect(user.jti).to be_present
    end

    it "gives a unique jti to each user" do
      user1 = create(:user)
      user2 = create(:user)
      expect(user1.jti).not_to eq(user2.jti)
    end
  end
end
