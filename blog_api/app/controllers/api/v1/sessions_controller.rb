module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :authenticate_user!, only: [ :create ]

      def create
        user = User.find_by(email: params.dig(:user, :email)&.strip&.downcase)

        if user&.authenticate(params.dig(:user, :password))
          token = JwtService.encode({ user_id: user.id, jti: user.jti })
          response.headers["Authorization"] = "Bearer #{token}"
          render json: { user: { id: user.id, email: user.email } }, status: :ok
        else
          render json: { error: "Email ou mot de passe invalide" }, status: :unauthorized
        end
      end

      def destroy
        current_user.update!(jti: SecureRandom.uuid)
        render json: { message: "Déconnecté avec succès" }, status: :ok
      end
    end
  end
end
