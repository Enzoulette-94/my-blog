module AuthHelpers
  def auth_headers(user)
    token = JwtService.encode({ user_id: user.id, jti: user.jti })
    { "Authorization" => "Bearer #{token}", "Content-Type" => "application/json" }
  end

  def json_body
    JSON.parse(response.body)
  end

  def response_token
    response.headers["Authorization"]&.split(" ")&.last
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
