class ApplicationController < ActionController::API
  before_action :authenticate_user!

  private

  def authenticate_user!
    authenticate_user
    render_unauthorized unless @current_user
  end

  # Authentification optionnelle : lit le token s'il est présent, mais ne bloque pas
  def authenticate_user
    token = extract_token
    return unless token

    payload = JwtService.decode(token)
    @current_user = User.find_by(id: payload[:user_id], jti: payload[:jti])
  rescue JwtService::InvalidTokenError
    nil
  end

  def current_user
    @current_user
  end

  def extract_token
    header = request.headers["Authorization"]
    header&.split(" ")&.last
  end

  def render_unauthorized
    render json: { error: "Non autorisé" }, status: :unauthorized
  end
end
