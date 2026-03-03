module Api
  module V1
    class StatsController < ApplicationController
      skip_before_action :authenticate_user!

      def index
        latest_article = Article.public_articles.order(created_at: :desc).first
        latest_photo   = Photo.order(created_at: :desc).first

        render json: {
          articles_count: Article.public_articles.count,
          photos_count:   Photo.count,
          users_count:    User.count,
          latest_article: latest_article && {
            id:         latest_article.id,
            title:      latest_article.title,
            created_at: latest_article.created_at
          },
          latest_photo: latest_photo && {
            id:         latest_photo.id,
            created_at: latest_photo.created_at
          }
        }
      end
    end
  end
end
