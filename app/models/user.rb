class User < ApplicationRecord
  include Followable

  FOLLOWABLE_TYPES = ['Artist', 'Album', 'Playlist', 'User']

  validates :email, presence: true, uniqueness: true
  validates :name, :session_token, :birthday, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }
  validates :password, confirmation: { case_sensitive: true, message: "\nPasswords do not match" }
  after_initialize :ensure_session_token

  has_attached_file :avatar,
    default_url: 'avatar.png',
    styles: { thumb: "300x300#", large: "600x600#" }

  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/

  has_many :playlists, foreign_key: :author_id
  has_many :saved_tracks
  has_many :tracks, through: :saved_tracks, source: :track
  has_many :followings, class_name: 'Follow'
  has_many :searches
  has_many :followed_users, through: :followings, source: :followable, source_type: 'User'

  def self.search(query)
    where('lower(name) ~* :query or
           lower(email) ~* :query
          ', query: query)
  end

  def match_weight(query)
    "#{name}#{email}".downcase.scan(Regexp.new(query)).map(&:length).inject(:+)
  end

  def track_ids_by_date
    SavedTrack.joins(:user, :track)
      .where('users.id': id)
      .order(created_at: :desc)
      .pluck(:track_id)
  end

  def followable_ids_for(type)
    followings
      .where(followable_type: type)
      .pluck(:followable_id)
  end

  def method_missing(name, *args, &blck)
    if name.to_s.match(/^followed_/)
      model_name = constantize(name)

      super unless FOLLOWABLE_TYPES.include? model_name

      Object.const_get(model_name).where(id: followable_ids_for(model_name))
    else
      super
    end
  end

  def save_track(track_id)
    update(track_ids: track_ids + [track_id])
  end

  def remove_track(track_id)
    update(track_ids: track_ids - [track_id.to_i])
  end

  # def self.track_ids_for_current_user
  #   SavedTrack.joins(:user, :track)
  #   .where('users.id': current_user.id)
  #   .order(created_at: :desc)
  #   .pluck(:track_id)
  # end

  ### AUTH METHODS ------------------------------------

  def self.find_by_credentials(email, pw)
    user = User.find_by(email: email)

    user && user.is_password?(pw) ? user : nil
  end


  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end

  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!
    self.session_token
  end

  def is_password?(pw)
    BCrypt::Password.new(self.password_digest).is_password?(pw)
  end

  def password=(pw)
    @password = pw
    self.password_digest = BCrypt::Password.create(pw)
  end

  private

  def constantize(classname)
    classname.to_s.match(/^followed_(.+)s$/)[1].capitalize
  end

  attr_reader :password
end
