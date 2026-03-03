FactoryBot.define do
  factory :article do
    sequence(:title) { |n| "Article titre #{n}" }
    content { "Contenu de l'article en question." }
    private { false }
    association :user

    trait :private do
      private { true }
    end
  end
end
