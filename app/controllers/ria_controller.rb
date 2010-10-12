class RiaController < ApplicationController
  before_filter :require_user
  respond_to :html, :json
  layout false
  
  def index
  end
  
  def loader
    @activity         = current_user.activity
    @channel_activity = current_user.channel_activity
    @channels         = current_user.channels
    @roster           = current_user.roster
    @users            = [current_user]
    
    render :json => {
        :activity         => @activity,
        :channel_activity => @channel_activity,
        :channels         => @channels,
        :roster           => @roster,
        :users            => @users
      }
  end
  
  include SuperRPC::Controller  
end
