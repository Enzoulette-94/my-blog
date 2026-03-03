FactoryBot.define do
  factory :photo do
    association :user

    after(:build) do |photo|
      photo.image.attach(
        io: StringIO.new("fake image data"),
        filename: "test.jpg",
        content_type: "image/jpeg"
      )
    end
  end
end
