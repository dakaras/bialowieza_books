class SessionsController < ApplicationController

  def new
  end

  def create
    # log in via omniauth
    if auth_hash = request.env['omniauth.auth']
      user = User.find_or_create_by_omniauth(auth_hash)
      session[:user_id] = user.id
      if user.cart == nil
        user.build_cart
        user.save
      end
      redirect_to root_path, notice: "You have successfully signed in as #{user.name.capitalize} through your Github account."
    else
      # log in via Bialowieza user account
      @user = User.find_by(email: params[:email])
      if @user && @user.authenticate(params[:password])
        session[:user_id] = @user.id
        redirect_to books_path, notice: "Welcome back #{@user.name.capitalize}!"
      else
        flash[:notice] = "Incorrect email or password. Please try logging in again."
        render 'sessions/new' # login_path
      end
    end
  end

  def destroy
    reset_session
    redirect_to root_path, notice: "You have successfully logged out."
  end
end
