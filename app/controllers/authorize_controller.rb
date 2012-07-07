class AuthorizeController < ApplicationController
  def create
    cookies.permanent.signed[:handle] = request.env["omniauth.auth"]["user_info"]["name"]
    redirect_to "/"
  end
  
  def failure
    raise "OAuth failure - #{params[:message]}"
  end
  
  def destroy
    cookies.delete(:handle)
  end
end
