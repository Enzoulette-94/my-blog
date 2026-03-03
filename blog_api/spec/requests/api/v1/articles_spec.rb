require 'rails_helper'

RSpec.describe "Articles", type: :request do
  let!(:owner)   { create(:user) }
  let!(:other)   { create(:user) }
  let!(:public_article)  { create(:article, user: owner, private: false) }
  let!(:private_article) { create(:article, :private, user: owner) }

  describe "GET /api/v1/articles" do
    it "retourne les articles publics sans authentification" do
      get "/api/v1/articles"
      expect(response).to have_http_status(:ok)
      ids = json_body.map { |a| a["id"] }
      expect(ids).to include(public_article.id)
      expect(ids).not_to include(private_article.id)
    end

    it "inclut les articles privés de l'owner authentifié" do
      get "/api/v1/articles", headers: auth_headers(owner)
      ids = json_body.map { |a| a["id"] }
      expect(ids).to include(private_article.id)
    end

    it "n'inclut pas les articles privés d'un autre user" do
      get "/api/v1/articles", headers: auth_headers(other)
      ids = json_body.map { |a| a["id"] }
      expect(ids).not_to include(private_article.id)
    end
  end

  describe "GET /api/v1/articles/:id" do
    it "retourne un article public sans auth" do
      get "/api/v1/articles/#{public_article.id}"
      expect(response).to have_http_status(:ok)
      expect(json_body["title"]).to eq(public_article.title)
    end

    it "retourne le contenu de l'article" do
      get "/api/v1/articles/#{public_article.id}"
      expect(json_body["content"]).to be_present
    end

    it "retourne 403 pour un article privé si non authentifié" do
      get "/api/v1/articles/#{private_article.id}"
      expect(response).to have_http_status(:forbidden)
    end

    it "retourne 403 pour l'article privé d'un autre user" do
      get "/api/v1/articles/#{private_article.id}", headers: auth_headers(other)
      expect(response).to have_http_status(:forbidden)
    end

    it "autorise l'owner à voir son article privé" do
      get "/api/v1/articles/#{private_article.id}", headers: auth_headers(owner)
      expect(response).to have_http_status(:ok)
    end

    it "retourne 404 si l'article n'existe pas" do
      get "/api/v1/articles/999999"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/articles" do
    let(:valid_params) { { article: { title: "Nouveau titre", content: "Contenu valide", private: false } } }

    it "retourne 401 sans authentification" do
      post "/api/v1/articles", params: valid_params.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(response).to have_http_status(:unauthorized)
    end

    it "crée un article avec auth" do
      expect {
        post "/api/v1/articles", params: valid_params.to_json, headers: auth_headers(owner)
      }.to change(Article, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it "associe l'article à l'utilisateur courant" do
      post "/api/v1/articles", params: valid_params.to_json, headers: auth_headers(owner)
      expect(json_body["author"]).to eq(owner.email)
    end

    it "retourne 422 si le titre est manquant" do
      post "/api/v1/articles",
           params: { article: { title: "", content: "Contenu" } }.to_json,
           headers: auth_headers(owner)
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "retourne 422 si le contenu est manquant" do
      post "/api/v1/articles",
           params: { article: { title: "Titre", content: "" } }.to_json,
           headers: auth_headers(owner)
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/articles/:id" do
    it "retourne 401 sans auth" do
      patch "/api/v1/articles/#{public_article.id}",
            params: { article: { title: "Nouveau" } }.to_json,
            headers: { "Content-Type" => "application/json" }
      expect(response).to have_http_status(:unauthorized)
    end

    it "retourne 403 si l'utilisateur n'est pas l'auteur" do
      patch "/api/v1/articles/#{public_article.id}",
            params: { article: { title: "Nouveau" } }.to_json,
            headers: auth_headers(other)
      expect(response).to have_http_status(:forbidden)
    end

    it "met à jour l'article si l'utilisateur est l'auteur" do
      patch "/api/v1/articles/#{public_article.id}",
            params: { article: { title: "Titre modifié" } }.to_json,
            headers: auth_headers(owner)
      expect(response).to have_http_status(:ok)
      expect(json_body["title"]).to eq("Titre modifié")
    end
  end

  describe "DELETE /api/v1/articles/:id" do
    it "retourne 401 sans auth" do
      delete "/api/v1/articles/#{public_article.id}"
      expect(response).to have_http_status(:unauthorized)
    end

    it "retourne 403 si l'utilisateur n'est pas l'auteur" do
      delete "/api/v1/articles/#{public_article.id}", headers: auth_headers(other)
      expect(response).to have_http_status(:forbidden)
    end

    it "supprime l'article si l'utilisateur est l'auteur" do
      expect {
        delete "/api/v1/articles/#{public_article.id}", headers: auth_headers(owner)
      }.to change(Article, :count).by(-1)
      expect(response).to have_http_status(:ok)
    end
  end
end
