class Author < ApplicationRecord
  has_many :books
  scope :alphabetical, -> {order(name: :asc).limit(10)}
  scope :starts_with, -> (name) { where("name like ?", "#{name}%")}

  def first_name
    first_name = self.name.split(' ', 2).first
  end

  def last_name
    last_name = self.name.split(' ', 2).last
  end

  def self.sorted_last_names
    names = []
    self.all.map do |author|
      names << author.last_name
    end
    names.sort
  end

  def self.most_published
    self.all.sort_by { |author| author.books.size}.reverse
  end

end
