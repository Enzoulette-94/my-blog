require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  let!(:user) { create(:user, email: "auth@example.com", password: "password123", password_confirmation: "password123") }

  describe "POST /api/v1/login" do
    context "avec des identifiants valides" do
      it "retourne 200" do
        post "/api/v1/login",
             params: { user: { email: "auth@example.com", password: "password123" } }.to_json,
             headers: { "Content-Type" => "application/json" }
        expect(response).to have_http_status(:ok)
      end

      it "retourne un JWT dans le header" do
        post "/api/v1/login",
             params: { user: { email: "auth@example.com", password: "password123" } }.to_json,
             headers: { "Content-Type" => "application/json" }
        expect(response.headers["Authorization"]).to match(/^Bearer .+/)
      end

      it "accepte l'email avec des majuscules (case-insensitive)" do
        post "/api/v1/login",
             params: { user: { email: "AUTH@EXAMPLE.COM", password: "password123" } }.to_json,
             headers: { "Content-Type" => "application/json" }
        expect(response).to have_http_status(:ok)
      end
    end

    context "avec des identifiants invalides" do
      it "retourne 401 avec un mauvais mot de passe" do
        post "/api/v1/login",
             params: { user: { email: "auth@example.com", password: "wrongpassword" } }.to_json,
             headers: { "Content-Type" => "application/json" }
        expect(response).to have_http_status(:unauthorized)
      end

      it "retourne 401 avec un email inconnu" do
        post "/api/v1/login",
             params: { user: { email: "nobody@example.com", password: "password123" } }.to_json,
             headers: { "Content-Type" => "application/json" }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/logout" do
    it "retourne 200 et invalide le token" do
      delete "/api/v1/logout", headers: auth_headers(user)
      expect(response).to have_http_status(:ok)
    end

    it "rend l'ancien token inutilisable après logout" do
      old_token = JwtService.encode({ user_id: user.id, jti: user.jti })
      delete "/api/v1/logout", headers: auth_headers(user)

      get "/api/v1/photos", headers: { "Authorization" => "Bearer #{old_token}" }
      expect(response).to have_http_status(:unauthorized)
    end

    it "retourne 401 sans token" do
      delete "/api/v1/logout"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
