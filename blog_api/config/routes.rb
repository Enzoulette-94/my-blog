Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "/signup", to: "registrations#create"
      post "/login",  to: "sessions#create"
      delete "/logout", to: "sessions#destroy"

      resources :articles do
        resources :comments, only: [ :index, :create, :destroy ]
      end

      get "/stats", to: "stats#index"

      resources :photos, only: [ :index, :show, :create, :destroy ] do
        collection do
          get :public
        end
      end
    end
  end
end
