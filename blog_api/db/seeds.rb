puts "Nettoyage de la base..."
Comment.destroy_all
Article.destroy_all
User.destroy_all

puts "Création des utilisateurs..."
users = 5.times.map do |i|
  User.create!(
    email: Faker::Internet.unique.email,
    password: "password123",
    password_confirmation: "password123"
  )
end

puts "Création de 30 articles..."
30.times do
  user = users.sample
  Article.create!(
    title: Faker::Lorem.sentence(word_count: 5).chomp("."),
    content: Faker::Lorem.paragraphs(number: 3).join("\n\n"),
    user: user,
    private: [ true, false, false, false ].sample  # 25% privés
  )
end

puts "Création de commentaires..."
Article.public_articles.each do |article|
  rand(1..4).times do
    Comment.create!(
      content: Faker::Lorem.sentence(word_count: rand(8..20)),
      user: users.sample,
      article: article
    )
  end
end

puts "Terminé!"
puts "  #{User.count} utilisateurs"
puts "  #{Article.count} articles (#{Article.where(private: true).count} privés)"
puts "  #{Comment.count} commentaires"
