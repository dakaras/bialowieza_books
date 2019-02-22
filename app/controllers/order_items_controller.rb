class OrderItemsController < ApplicationController
  before_action :authorize
  before_action :logged_in

  def index
    @order_items = current_cart.order_items
    @total_cost = calculate_total
  end

  def create
   @item = current_cart.order_items.build(item_params)
   @item.save
   session[:cart_id] = current_user.cart.id
   redirect_to order_items_path
  end

  def destroy
    @order = current_cart
    @item = @order.order_items.find(params[:id])
    @item.destroy
    @order.save
    redirect_to order_items_path
  end

  private
  def item_params
    params.require(:order_item).permit(:quantity, :book_id, :cart_id)
  end

  def calculate_total
    @total_cost = current_cart.order_items.collect { |oi| oi.book.price * oi.quantity }.sum
  end
end
