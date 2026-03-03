require "open-uri"

puts "Nettoyage de la base..."
Comment.destroy_all
Article.destroy_all
Photo.destroy_all
User.destroy_all

puts "Création des utilisateurs..."
users = [
  { email: "redac@enzouletteblog.com" },
  { email: "supporter.ol@gmail.com" },
  { email: "fan.barca@gmail.com" },
  { email: "brasil.futebol@gmail.com" },
  { email: "messi.fan@gmail.com" }
].map do |attrs|
  User.create!(
    email: attrs[:email],
    password: "password123",
    password_confirmation: "password123"
  )
end

ARTICLES = [
  # OL
  {
    title: "L'OL de retour en Ligue des Champions",
    content: "L'Olympique Lyonnais réalise une saison exceptionnelle et retrouve la scène européenne. Après plusieurs années difficiles, le club rhodanien a retrouvé son niveau d'antan grâce à un recrutement ciblé et un projet de jeu ambitieux.\n\nLe Parc OL affiche complet à chaque match. Les supporters sont au rendez-vous pour soutenir leur équipe dans cette nouvelle aventure européenne. L'ambiance dans les tribunes est électrisante, rappelant les grandes soirées européennes des années 2000.\n\nLes observateurs s'accordent à dire que cette équipe a les moyens de passer les phases de groupes et de viser les huitièmes de finale. Affaire à suivre de près.",
    theme: :ol
  },
  {
    title: "Alexandre Lacazette, le roi de Lyon",
    content: "Revenu à l'OL après son passage à Arsenal et à l'Atletico Madrid, Alexandre Lacazette régale le public lyonnais de ses buts et de ses passes décisives. Le capitaine de l'équipe incarne parfaitement l'identité du club.\n\nAvec plus de 150 buts sous le maillot lyonnais toutes compétitions confondues, il est désormais l'un des meilleurs buteurs de l'histoire du club. Sa technique, sa vision du jeu et son sens du but font de lui un joueur à part.\n\nA 32 ans, il semble avoir retrouvé une seconde jeunesse et continue de faire la différence dans les grands matchs. Un vrai leader sur et en dehors du terrain.",
    theme: :ol
  },
  {
    title: "Derby OL - ASSE : la guerre des étoiles",
    content: "Le derby entre l'Olympique Lyonnais et l'AS Saint-Étienne est l'un des matchs les plus attendus de la saison en Ligue 1. Une rivalité historique, intense et passionnée qui transcende le simple cadre du football.\n\nL'OL domine largement la série ces dernières années avec un bilan très favorable. Mais les Verts, forts de leur soutien populaire, ont toujours l'ambition de créer la surprise dans ce choc régional.\n\nCette confrontation dépasse largement le cadre sportif : c'est une question d'identité, d'honneur et de fierté régionale. Les 90 minutes du derby sont souvent parmi les plus intenses de la saison.",
    theme: :ol,
    private: true
  },
  {
    title: "Le centre de formation de l'OL, une référence en Europe",
    content: "L'Académie de l'Olympique Lyonnais est reconnue comme l'une des meilleures d'Europe. Elle a formé des joueurs de classe mondiale comme Karim Benzema, Hatem Ben Arfa ou encore Nabil Fékir.\n\nChaque année, de jeunes talents émergent de ce vivier exceptionnel. La philosophie du club est claire : développer des joueurs techniquement brillants, intelligents tactiquement et forts mentalement.\n\nCette politique de formation est un axe majeur du projet sportif du club. Elle permet à l'OL de maintenir un niveau élevé tout en dégageant des plus-values importantes lors des ventes de joueurs formés maison.",
    theme: :ol
  },
  # Brésil
  {
    title: "La Seleção et son football magique",
    content: "Le Brésil est la nation la plus titrée de l'histoire de la Coupe du Monde avec cinq étoiles sur le maillot. Mais au-delà des titres, c'est un style de jeu unique qui a fait la renommée mondiale de la Seleção.\n\nLe jogo bonito — le beau jeu — est une philosophie héritée des grandes générations : Pelé, Garrincha, Zico, Ronaldo, Ronaldinho... Ces joueurs ont transcendé le football pour en faire un art.\n\nAujourd'hui, une nouvelle génération conduite par Vinicius Jr, Rodrygo et Endrick tente de perpétuer cette tradition d'excellence et de créativité qui fait la fierté du football brésilien.",
    theme: :bresil
  },
  {
    title: "Vinicius Jr : le nouveau roi du Brésil",
    content: "Parti du Flamengo adolescent pour rejoindre le Real Madrid, Vinicius Jr est devenu l'un des meilleurs joueurs du monde. Ses dribbles déroutants, sa vitesse et son sens du but font de lui une arme fatale.\n\nBallondoriste potentiel, il porte sur ses épaules les espoirs de tout un peuple. Son parcours est celui d'un garçon des favelas qui a réalisé son rêve à force de travail et de détermination.\n\nSur le terrain, il illumine les matchs par ses gestes techniques et sa joie communicative. Son style de jeu incarne parfaitement l'esprit brésilien : technique, spontané et spectaculaire.",
    theme: :bresil
  },
  {
    title: "Ronaldinho, la légende qui danse encore",
    content: "Il est sans doute le joueur le plus spectaculaire de l'histoire du football. Ronaldinho, avec son sourire légendaire et ses gestes magiques, a transformé le ballon rond en objet de pur plaisir.\n\nDouble Ballon d'Or (2004, 2005), champion du monde en 2002, champion d'Europe en 2006 avec le Barça... son palmarès parle pour lui. Mais c'est surtout son empreinte artistique sur le football qui restera gravée dans les mémoires.\n\nAujourd'hui retraité, il continue d'être une icône mondiale. Sa légèreté, sa joie de jouer et ses dribbles impossibles ont inspiré une génération entière de footballeurs, dont un certain Lionel Messi.",
    theme: :bresil
  },
  {
    title: "Coupe du Monde 2026 : le Brésil favori ?",
    content: "La Coupe du Monde 2026 aux États-Unis, Canada et Mexique approche à grands pas. Le Brésil, toujours en quête d'une sixième étoile depuis 2002, figure parmi les grands favoris de la compétition.\n\nAvec Vinicius Jr en grande forme, Rodrygo, Endrick et une génération dorée qui arrive à maturité, la Seleção a tous les arguments pour prétendre au titre suprême.\n\nLe seul point de vigilance reste la cohérence tactique de l'équipe et la capacité à être solides défensivement lors des grands matchs couperets. Les phases finales de Coupe du Monde ont souvent réservé des surprises au Brésil.",
    theme: :bresil,
    private: true
  },
  # FC Barcelone
  {
    title: "Le FC Barcelone et le tiki-taka : une révolution",
    content: "Entre 2008 et 2012, le FC Barcelone a révolutionné le football mondial avec son style de jeu basé sur la possession et les courtes passes. Le tiki-taka, popularisé par Pep Guardiola, est devenu la référence tactique mondiale.\n\nCe système reposait sur des joueurs d'exception : Xavi, Iniesta, Busquets en milieu de terrain, et bien sûr Lionel Messi comme faux numéro 9. Ensemble, ils ont remporté deux Ligues des Champions (2009, 2011) et trois titres de champions d'Espagne consécutifs.\n\nCette période dorée a laissé une empreinte indélébile sur le football mondial. Des générations entières d'entraîneurs se sont inspirées du Barça de Guardiola.",
    theme: :barca
  },
  {
    title: "La Masia : l'usine à champions du Barça",
    content: "La Masia est le centre de formation du FC Barcelone. Fondée en 1979, elle a produit certains des meilleurs joueurs de l'histoire du football : Xavi Hernandez, Andres Iniesta, Carles Puyol, Gerard Piqué, Cesc Fabregas, Pedro... et un certain Lionel Messi.\n\nLa philosophie de la Masia est unique : on ne forme pas seulement des footballeurs, on forme des hommes. Les valeurs du club — respect, humilité, travail collectif — sont transmises dès le plus jeune âge.\n\nAujourd'hui, la nouvelle génération Pedri, Gavi, Lamine Yamal perpétue cette tradition d'excellence. La Masia reste la référence mondiale en matière de formation de jeunes joueurs.",
    theme: :barca
  },
  {
    title: "Lamine Yamal, le prodige catalan",
    content: "À seulement 17 ans, Lamine Yamal est déjà considéré comme l'un des meilleurs joueurs du monde. Formé à la Masia, il a explosé au grand jour lors de l'Euro 2024 avec l'Espagne, inscrivant un but extraordinaire en demi-finale.\n\nSon talent précoce rappelle celui d'un autre prodige catalan : Lionel Messi, qui avait lui aussi rejoint la Masia très jeune. La comparaison, flatteuse, ne semble pas peser sur ses épaules.\n\nAu FC Barcelone, il est le symbole d'un nouveau cycle. Avec Pedri, Gavi et Fermín López, le Barça peut rêver de retrouver les sommets continentaux et mondiaux dans les années à venir.",
    theme: :barca
  },
  {
    title: "Camp Nou, le temple du football catalan",
    content: "Le Camp Nou est le plus grand stade d'Europe avec une capacité de près de 100 000 spectateurs. Inauguré en 1957, il est le théâtre des plus grandes heures du FC Barcelone.\n\nActuellement en rénovation pour devenir l'Espai Barça, le stade sera transformé en une enceinte ultra-moderne tout en conservant son âme historique. La capacité sera portée à 105 000 places avec une acoustique améliorée.\n\nPour des millions de supporters à travers le monde, le Camp Nou est bien plus qu'un stade. C'est un lieu de pèlerinage, un symbole d'une identité culturelle forte : Més que un club — plus qu'un club.",
    theme: :barca
  },
  # Messi
  {
    title: "Lionel Messi, le GOAT du football",
    content: "Lionel Andrés Messi est le meilleur joueur de football de tous les temps. Ses huit Ballons d'Or, ses 700 buts en club, son titre de Champion du Monde 2022 avec l'Argentine : les chiffres donnent le vertige.\n\nNé à Rosario en Argentine en 1987, il rejoint la Masia du FC Barcelone à 13 ans malgré une maladie de croissance. Le club catalan finance son traitement et lui offre une seconde vie. La suite appartient à l'histoire.\n\nAvec Barcelone, il remporte 10 titres de champion d'Espagne, 4 Ligues des Champions, 7 Coupes du Roi... Une domination sans précédent sur le football mondial qui durera 21 ans.",
    theme: :messi
  },
  {
    title: "La Coupe du Monde 2022 : Messi enfin sacré",
    content: "Le 18 décembre 2022 au Qatar, Lionel Messi a soulevé la Coupe du Monde. Un moment d'une intensité émotionnelle rare, qui a ému le monde entier. Le GOAT avait enfin son titre le plus précieux.\n\nEn finale contre la France, l'Argentine a vécu un match d'anthologie. Menée 2-0, l'équipe de Didier Deschamps a renversé la vapeur grâce à un doublé de Kylian Mbappé pour revenir à 2-2. Puis en prolongations, Messi a remis les siens devant avant que Mbappé ne marque son troisième but. La séance de tirs au but a finalement souri à l'Albiceleste.\n\nPour Messi, c'est l'accomplissement d'une carrière déjà parfaite. Les larmes du numéro 10 argentin après le coup de sifflet final resteront l'une des images les plus iconiques du football mondial.",
    theme: :messi
  },
  {
    title: "Messi vs Ronaldo : le débat éternel",
    content: "Pendant plus de quinze ans, le football mondial a été partagé entre deux camps : les fans de Messi et ceux de Ronaldo. Ce débat passionné a transcendé les frontières et les générations.\n\nD'un côté, Messi : la grâce naturelle, le dribble déroutant, la vision du jeu hors du commun, huit Ballons d'Or. De l'autre, Ronaldo : la puissance physique, le travail acharné, la determination mentale, cinq Ballons d'Or.\n\nLe sacre de Messi en Coupe du Monde 2022 a souvent été cité comme l'argument définitif en sa faveur dans ce débat sans fin. Mais une chose est sûre : nous avons eu la chance extraordinaire d'assister en même temps aux carrières de deux des plus grands joueurs de tous les temps.",
    theme: :messi
  },
  {
    title: "Messi à l'Inter Miami : une nouvelle vie en MLS",
    content: "En 2023, Lionel Messi a rejoint l'Inter Miami en MLS, le championnat américain. Loin d'être une retraite dorée, il a immédiatement porté son équipe et la ligue à un niveau de visibilité jamais atteint.\n\nDès ses premiers matchs, il a enchaîné les buts et les performances extraordinaires, remportant la Leagues Cup. Les billets pour voir jouer l'Inter Miami se sont arrachés à des prix records dans tous les stades du continent américain.\n\nÀ 37 ans, Messi continue de montrer que le talent ne vieillit pas. Son passage en MLS est en train de transformer le football américain et d'inspirer des millions de jeunes joueurs aux États-Unis.",
    theme: :messi,
    private: true
  },
  {
    title: "Les 91 buts de Messi en 2012, un record absolu",
    content: "En 2012, Lionel Messi a inscrit 91 buts en une seule année civile, battant le record précédemment détenu par Gerd Müller (85 buts en 1972). Un record qui semblait impossible et qui restera probablement pour toujours.\n\nCette année-là, tout semblait facile pour le numéro 10 du Barça. Buts sur coup franc, de la tête, du pied gauche, du pied droit, en championnat, en Ligue des Champions, en équipe nationale... Il a marqué de toutes les façons possibles.\n\nCe record illustre parfaitement ce qui distingue Messi des autres grands joueurs : une régularité et une efficacité absolument démentielle sur la durée. 91 buts en 365 jours, c'est plus d'un but tous les quatre jours.",
    theme: :messi
  }
].freeze

COMMENTS = {
  ol: [
    "Allez l'OL ! On croit en vous pour cette saison !",
    "Le Parc OL était incroyable hier soir, quelle ambiance !",
    "Lacazette est indispensable à cette équipe, un vrai leader.",
    "J'espère qu'on va passer les phases de poule en C1 cette année.",
    "Le derby contre Saint-Étienne c'est toujours un match à part !",
    "La formation à Lyon est vraiment excellente, on produit de vrais talents.",
    "Quel beau club, l'OL mérite d'être au sommet du foot français.",
  ],
  bresil: [
    "Le Brésil est et restera la plus belle équipe de l'histoire du foot !",
    "Vinicius Jr est le successeur naturel de Ronaldinho.",
    "Le jogo bonito c'est une philosophie de vie, pas juste du football.",
    "2026, le Brésil va chercher sa 6ème étoile j'en suis convaincu !",
    "Ronaldinho reste le joueur le plus spectaculaire que j'ai jamais vu.",
    "La génération actuelle est vraiment prometteuse pour le Brésil.",
    "Pelé sera éternellement le roi du football brésilien.",
  ],
  barca: [
    "Mes que un club, une vraie philosophie de jeu et de vie !",
    "La Masia est la meilleure académie du monde, sans discussion.",
    "Lamine Yamal va devenir le meilleur joueur du monde dans quelques années.",
    "Le tiki-taka de Guardiola était une révolution absolue dans le foot.",
    "Le Camp Nou rénové va être un stade magnifique.",
    "Gavi et Pedri forment le meilleur milieu du monde actuellement.",
    "Le Barça doit revenir au sommet de l'Europe, c'est sa place naturelle.",
  ],
  messi: [
    "GOAT indiscutable. Fin du débat.",
    "La finale 2022 contre la France était le match du siècle !",
    "Messi à 37 ans joue encore mieux que la plupart des joueurs à 25 ans.",
    "91 buts en une année... ce record ne sera jamais battu.",
    "Sa technique de dribble est quelque chose d'inimitable.",
    "Le voir soulever la Coupe du Monde m'a fait pleurer de joie.",
    "Même en MLS il est le meilleur joueur de la compétition, c'est dire.",
    "Ronaldo est grand mais Messi c'est autre chose, c'est de l'art pur.",
  ]
}.freeze

puts "Création des articles..."
ARTICLES.each do |data|
  user = users.sample
  Article.create!(
    title:   data[:title],
    content: data[:content],
    user:    user,
    private: data[:private] || false
  )
end

puts "Création des commentaires..."
Article.public_articles.each do |article|
  theme = ARTICLES.find { |a| a[:title] == article.title }&.dig(:theme) || :messi
  pool = COMMENTS[theme] || COMMENTS[:messi]

  rand(2..5).times do
    Comment.create!(
      content: pool.sample,
      user:    users.sample,
      article: article
    )
  end
end

puts "Téléchargement des photos..."
PHOTOS = [
  { keyword: "football",          lock: 1,  label: "football-1.jpg" },
  { keyword: "football",          lock: 2,  label: "football-2.jpg" },
  { keyword: "soccer",            lock: 1,  label: "soccer-1.jpg" },
  { keyword: "soccer",            lock: 3,  label: "soccer-2.jpg" },
  { keyword: "stadium",           lock: 1,  label: "stadium-1.jpg" },
  { keyword: "stadium",           lock: 2,  label: "stadium-2.jpg" },
  { keyword: "barcelona,football",lock: 1,  label: "barcelona-1.jpg" },
  { keyword: "lyon,football",     lock: 1,  label: "lyon-1.jpg" },
  { keyword: "argentina,football",lock: 1,  label: "argentina-1.jpg" },
  { keyword: "brazil,football",   lock: 1,  label: "brazil-1.jpg" },
].freeze

PHOTOS.each do |photo_data|
  url = "https://loremflickr.com/800/600/#{photo_data[:keyword]}?lock=#{photo_data[:lock]}"
  user = users.sample

  begin
    file = URI.open(url, read_timeout: 15)
    photo = user.photos.new
    photo.image.attach(
      io:           file,
      filename:     photo_data[:label],
      content_type: "image/jpeg"
    )
    photo.save!
    puts "  ✓ #{photo_data[:label]}"
  rescue => e
    puts "  ✗ #{photo_data[:label]} — #{e.message}"
  end
end

puts "Terminé !"
puts "  #{User.count} utilisateurs"
puts "  #{Article.count} articles (#{Article.where(private: true).count} privés)"
puts "  #{Comment.count} commentaires"
puts "  #{Photo.count} photos"
