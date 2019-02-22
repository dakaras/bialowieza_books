class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :book_id, :cart_id
  belongs_to :cart
  belongs_to :book
end
