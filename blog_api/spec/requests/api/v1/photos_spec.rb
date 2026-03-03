require 'rails_helper'

RSpec.describe "Photos", type: :request do
  let!(:owner) { create(:user) }
  let!(:other) { create(:user) }
  let!(:photo) { create(:photo, user: owner) }

  describe "GET /api/v1/photos" do
    it "retourne 401 sans auth" do
      get "/api/v1/photos"
      expect(response).to have_http_status(:unauthorized)
    end

    it "retourne les photos de l'utilisateur courant" do
      create(:photo, user: other)
      get "/api/v1/photos", headers: auth_headers(owner)
      expect(response).to have_http_status(:ok)
      expect(json_body.length).to eq(1)
      expect(json_body.first["id"]).to eq(photo.id)
    end
  end

  describe "POST /api/v1/photos" do
    let(:image_file) do
      Rack::Test::UploadedFile.new(
        StringIO.new("fake image data"),
        "image/jpeg",
        original_filename: "test.jpg"
      )
    end

    it "retourne 401 sans auth" do
      post "/api/v1/photos", params: { image: image_file }
      expect(response).to have_http_status(:unauthorized)
    end

    it "crée une photo avec auth" do
      expect {
        post "/api/v1/photos",
             params: { image: image_file },
             headers: auth_headers(owner).except("Content-Type")
      }.to change(Photo, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it "retourne 422 sans image" do
      post "/api/v1/photos",
           params: {},
           headers: auth_headers(owner).except("Content-Type")
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "GET /api/v1/photos/public" do
    it "retourne toutes les photos sans auth" do
      create(:photo, user: other)
      get "/api/v1/photos/public"
      expect(response).to have_http_status(:ok)
      expect(json_body.length).to eq(2)
    end

    it "inclut les infos de l'auteur" do
      get "/api/v1/photos/public"
      expect(json_body.first).to include("user")
      expect(json_body.first["user"]).to include("id", "email")
    end
  end

  describe "GET /api/v1/photos/:id" do
    it "retourne la photo sans auth" do
      get "/api/v1/photos/#{photo.id}"
      expect(response).to have_http_status(:ok)
      expect(json_body["id"]).to eq(photo.id)
      expect(json_body["user"]["id"]).to eq(owner.id)
    end

    it "retourne 404 si la photo n'existe pas" do
      get "/api/v1/photos/0"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/photos/:id" do
    it "retourne 401 sans auth" do
      delete "/api/v1/photos/#{photo.id}"
      expect(response).to have_http_status(:unauthorized)
    end

    it "retourne 403 si l'utilisateur n'est pas le propriétaire" do
      delete "/api/v1/photos/#{photo.id}", headers: auth_headers(other)
      expect(response).to have_http_status(:forbidden)
    end

    it "supprime la photo si l'utilisateur est le propriétaire" do
      expect {
        delete "/api/v1/photos/#{photo.id}", headers: auth_headers(owner)
      }.to change(Photo, :count).by(-1)
      expect(response).to have_http_status(:ok)
    end
  end
end
