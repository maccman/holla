class ChannelsController < ApplicationController
  before_filter :require_user
  before_filter :find_channel, :only => [:update, :destroy]
  
  def index
    @channels = Channel.all
    render :json => @channels
  end
  
  def create
    Channel.create!(params)
    head :ok
  end
  
  def update
    @channel.update_attributes!(params)
    head :ok
  end
  
  def destroy
    @channel.destroy
    head :ok
  end
  
  private
    def find_channel
      @channel = Channel.find(params[:id])
    end
end
