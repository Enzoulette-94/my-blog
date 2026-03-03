require 'rails_helper'

RSpec.describe "POST /api/v1/signup", type: :request do
  let(:valid_params) do
    { user: { email: "new@example.com", password: "password123", password_confirmation: "password123" } }
  end

  context "avec des données valides" do
    it "crée un utilisateur et retourne 201" do
      expect {
        post "/api/v1/signup", params: valid_params.to_json,
             headers: { "Content-Type" => "application/json" }
      }.to change(User, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it "retourne le JWT dans le header Authorization" do
      post "/api/v1/signup", params: valid_params.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(response.headers["Authorization"]).to match(/^Bearer .+/)
    end

    it "retourne l'email de l'utilisateur" do
      post "/api/v1/signup", params: valid_params.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(json_body.dig("user", "email")).to eq("new@example.com")
    end
  end

  context "avec des données invalides" do
    it "retourne 422 si l'email est manquant" do
      post "/api/v1/signup",
           params: { user: { email: "", password: "password123", password_confirmation: "password123" } }.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "retourne 422 si l'email est déjà pris" do
      create(:user, email: "taken@example.com")
      post "/api/v1/signup",
           params: { user: { email: "taken@example.com", password: "password123", password_confirmation: "password123" } }.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "retourne 422 si les mots de passe ne correspondent pas" do
      post "/api/v1/signup",
           params: { user: { email: "new@example.com", password: "password123", password_confirmation: "wrong" } }.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "retourne 422 si le mot de passe est trop court" do
      post "/api/v1/signup",
           params: { user: { email: "new@example.com", password: "abc", password_confirmation: "abc" } }.to_json,
           headers: { "Content-Type" => "application/json" }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
