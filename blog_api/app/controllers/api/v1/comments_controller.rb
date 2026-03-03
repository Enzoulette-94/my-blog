module Api
  module V1
    class CommentsController < ApplicationController
      skip_before_action :authenticate_user!, only: [ :index ]
      before_action :authenticate_user, only: [ :index ]
      before_action :set_article
      before_action :set_comment, only: [ :destroy ]

      def index
        render json: @article.comments.includes(:user).map { |c| comment_json(c) }
      end

      def create
        comment = @article.comments.new(content: params.dig(:comment, :content), user: current_user)
        if comment.save
          render json: comment_json(comment), status: :created
        else
          render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        unless @comment.user == current_user
          return render json: { error: "Accès refusé" }, status: :forbidden
        end
        @comment.destroy
        render json: { message: "Commentaire supprimé" }, status: :ok
      end

      private

      def set_article
        @article = Article.find(params[:article_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Article introuvable" }, status: :not_found
      end

      def set_comment
        @comment = @article.comments.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Commentaire introuvable" }, status: :not_found
      end

      def comment_json(comment)
        {
          id: comment.id,
          content: comment.content,
          author: comment.user.email,
          created_at: comment.created_at
        }
      end
    end
  end
end
