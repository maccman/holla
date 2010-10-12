class PagesController < ApplicationController
  def index
    if logged_in?
      redirect_to ria_path
    else
      redirect_to login_path
    end
  end
end
