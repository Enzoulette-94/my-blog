class JwtService
  ALGORITHM = "HS256"
  EXPIRATION = 24.hours

  def self.encode(payload)
    payload[:exp] = EXPIRATION.from_now.to_i
    JWT.encode(payload, secret_key, ALGORITHM)
  end

  def self.decode(token)
    decoded = JWT.decode(token, secret_key, true, { algorithm: ALGORITHM })
    HashWithIndifferentAccess.new(decoded.first)
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    raise JwtService::InvalidTokenError, e.message
  end

  class InvalidTokenError < StandardError; end

  def self.secret_key
    Rails.application.credentials.secret_key_base
  end
  private_class_method :secret_key
end
