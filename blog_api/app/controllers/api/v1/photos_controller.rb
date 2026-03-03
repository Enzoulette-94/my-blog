module Api
  module V1
    class PhotosController < ApplicationController
      skip_before_action :authenticate_user!, only: [ :public, :show ]
      before_action :set_photo, only: [ :show, :destroy ]

      def index
        photos = current_user.photos.with_attached_image
        render json: photos.map { |p| photo_json(p) }
      end

      def public
        photos = Photo.with_attached_image.includes(:user).order(created_at: :desc)
        render json: photos.map { |p| public_photo_json(p) }
      end

      def show
        render json: public_photo_json(@photo)
      end

      def create
        photo = current_user.photos.new
        photo.image.attach(params[:image])

        if photo.save
          render json: photo_json(photo), status: :created
        else
          render json: { errors: photo.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        unless @photo.user == current_user
          return render json: { error: "Accès refusé" }, status: :forbidden
        end
        @photo.image.purge
        @photo.destroy
        render json: { message: "Photo supprimée" }, status: :ok
      end

      private

      def set_photo
        @photo = Photo.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Photo introuvable" }, status: :not_found
      end

      def photo_json(photo)
        {
          id: photo.id,
          url: photo.image.attached? ? url_for(photo.image) : nil,
          created_at: photo.created_at
        }
      end

      def public_photo_json(photo)
        {
          id: photo.id,
          url: photo.image.attached? ? url_for(photo.image) : nil,
          created_at: photo.created_at,
          user: {
            id: photo.user.id,
            email: photo.user.email
          }
        }
      end
    end
  end
end
