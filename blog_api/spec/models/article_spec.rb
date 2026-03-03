require 'rails_helper'

RSpec.describe Article, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
    it { should have_many(:comments).dependent(:destroy) }
  end

  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
  end

  describe "defaults" do
    it "is public by default" do
      article = create(:article)
      expect(article.private).to be false
    end
  end

  describe ".public_articles scope" do
    it "returns only public articles" do
      public_article  = create(:article, private: false)
      private_article = create(:article, :private)
      expect(Article.public_articles).to include(public_article)
      expect(Article.public_articles).not_to include(private_article)
    end
  end

  describe ".visible_to scope" do
    let(:owner) { create(:user) }
    let(:other) { create(:user) }
    let!(:public_article)  { create(:article, user: owner, private: false) }
    let!(:private_article) { create(:article, user: owner, private: true) }

    context "when user is nil (not authenticated)" do
      it "returns only public articles" do
        result = Article.visible_to(nil)
        expect(result).to include(public_article)
        expect(result).not_to include(private_article)
      end
    end

    context "when user is the owner" do
      it "returns both public and private articles" do
        result = Article.visible_to(owner)
        expect(result).to include(public_article, private_article)
      end
    end

    context "when user is someone else" do
      it "does not return the owner's private articles" do
        result = Article.visible_to(other)
        expect(result).to include(public_article)
        expect(result).not_to include(private_article)
      end
    end
  end
end
