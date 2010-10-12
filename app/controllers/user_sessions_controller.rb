class UserSessionsController < ApplicationController
  layout "backend"
    
  def new
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(params[:user_session])
    if @user_session.save
      flash[:notice] = "Login successful!"
      redirect_back_or_default :controller => "users"
    else
      render :action => :new
    end
  end

  def destroy
    if current_user_session
      current_user_session.destroy
    end
    reset_session
    flash[:notice] = "Logout successful"
    redirect_to new_user_session_url
  end
end