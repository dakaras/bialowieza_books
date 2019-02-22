class CartSerializer < ActiveModel::Serializer
  attributes :id, :user_id
  belongs_to :user
  has_many :order_items
  has_many :books, through: :order_items
end
