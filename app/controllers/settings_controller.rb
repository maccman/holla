class SettingsController < ApplicationController
  before_filter :require_user, :except => :connect
  layout "backend"
  
  def connect
    @channel = Channel.find(params[:id])
    if request.post?
      head(:forbidden) && return unless logged_in?
      
      unless current_user.channels.include?(@channel)
        current_user.channels << @channel
      end
      
      flash[:notice] = "Successfully connected"
      redirect_to ria_path
    else
      store_location
    end
  end
  
  def disconnect
    @channel = Channel.find(params[:id])
    current_user.channels.delete(@channel)
    head :ok
  end
end
