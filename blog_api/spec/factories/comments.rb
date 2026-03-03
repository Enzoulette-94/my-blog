FactoryBot.define do
  factory :comment do
    content { "Un commentaire pertinent." }
    association :user
    association :article
  end
end
