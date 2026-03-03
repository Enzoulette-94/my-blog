module Api
  module V1
    class ArticlesController < ApplicationController
      skip_before_action :authenticate_user!, only: [ :index, :show ]
      before_action :authenticate_user, only: [ :index, :show ]
      before_action :set_article, only: [ :show, :update, :destroy ]
      before_action :require_ownership!, only: [ :update, :destroy ]

      def index
        articles = Article.visible_to(current_user)
                          .includes(:user)
                          .order(created_at: :desc)
        render json: articles.map { |a| article_json(a) }
      end

      def show
        unless @article.user == current_user || !@article.private?
          return render json: { error: "Accès refusé" }, status: :forbidden
        end
        render json: article_json(@article, with_content: true)
      end

      def create
        article = current_user.articles.new(article_params)
        if article.save
          render json: article_json(article, with_content: true), status: :created
        else
          render json: { errors: article.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @article.update(article_params)
          render json: article_json(@article, with_content: true)
        else
          render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @article.destroy
        render json: { message: "Article supprimé" }, status: :ok
      end

      private

      def set_article
        @article = Article.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Article introuvable" }, status: :not_found
      end

      def require_ownership!
        unless @article.user == current_user
          render json: { error: "Accès refusé" }, status: :forbidden
        end
      end

      def article_params
        params.expect(article: [ :title, :content, :private ])
      end

      def article_json(article, with_content: false)
        json = {
          id: article.id,
          title: article.title,
          private: article.private,
          author: article.user.email,
          created_at: article.created_at
        }
        json[:content] = article.content if with_content
        json
      end
    end
  end
end
