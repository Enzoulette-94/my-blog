require 'rails_helper'

RSpec.describe "Comments", type: :request do
  let!(:owner)   { create(:user) }
  let!(:other)   { create(:user) }
  let!(:article) { create(:article, user: owner) }
  let!(:comment) { create(:comment, article: article, user: owner) }

  describe "GET /api/v1/articles/:article_id/comments" do
    it "retourne les commentaires sans authentification" do
      get "/api/v1/articles/#{article.id}/comments"
      expect(response).to have_http_status(:ok)
      expect(json_body.first["content"]).to eq(comment.content)
    end

    it "retourne 404 si l'article n'existe pas" do
      get "/api/v1/articles/999999/comments"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/articles/:article_id/comments" do
    let(:valid_params) { { comment: { content: "Très bon article!" } } }

    it "retourne 401 sans auth" do
      post "/api/v1/articles/#{article.id}/comments",
           params: valid_params.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(response).to have_http_status(:unauthorized)
    end

    it "crée un commentaire avec auth" do
      expect {
        post "/api/v1/articles/#{article.id}/comments",
             params: valid_params.to_json,
             headers: auth_headers(other)
      }.to change(Comment, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it "associe le commentaire à l'utilisateur courant" do
      post "/api/v1/articles/#{article.id}/comments",
           params: valid_params.to_json,
           headers: auth_headers(other)
      expect(json_body["author"]).to eq(other.email)
    end

    it "retourne 422 si le contenu est vide" do
      post "/api/v1/articles/#{article.id}/comments",
           params: { comment: { content: "" } }.to_json,
           headers: auth_headers(other)
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/v1/articles/:article_id/comments/:id" do
    it "retourne 401 sans auth" do
      delete "/api/v1/articles/#{article.id}/comments/#{comment.id}"
      expect(response).to have_http_status(:unauthorized)
    end

    it "retourne 403 si l'utilisateur n'est pas l'auteur du commentaire" do
      delete "/api/v1/articles/#{article.id}/comments/#{comment.id}",
             headers: auth_headers(other)
      expect(response).to have_http_status(:forbidden)
    end

    it "supprime le commentaire si l'utilisateur est l'auteur" do
      expect {
        delete "/api/v1/articles/#{article.id}/comments/#{comment.id}",
               headers: auth_headers(owner)
      }.to change(Comment, :count).by(-1)
      expect(response).to have_http_status(:ok)
    end
  end
end
