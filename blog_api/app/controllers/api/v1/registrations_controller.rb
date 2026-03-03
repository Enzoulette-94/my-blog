module Api
  module V1
    class RegistrationsController < ApplicationController
      skip_before_action :authenticate_user!

      def create
        user = User.new(user_params)

        if user.save
          token = JwtService.encode({ user_id: user.id, jti: user.jti })
          response.headers["Authorization"] = "Bearer #{token}"
          render json: { user: user_json(user) }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.expect(user: [ :email, :password, :password_confirmation ])
      end

      def user_json(user)
        { id: user.id, email: user.email }
      end
    end
  end
end
