Rails.application.routes.draw do
  get '/login', to: 'sessions#new'
  post '/sessions', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
  get '/auth/github/callback', to: 'sessions#create'
  root 'site#index'
  get '/about', to: 'site#about'

  resources :users, only: [:new, :create]
  resources :sessions, only: [:new, :create, :destroy]
  resources :authors do
    resources :books, only: [:new, :create, :show, :index]
  end
  resources :order_items
  post '/order_items/create/:id', to: 'orderitems#create', as: 'add_book'

  resources :books, only: [:show, :index]
  resources :authors, only: [:show, :index]
  get '/authors_list', to: 'authors#authors_list'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
