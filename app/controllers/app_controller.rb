class AppController < ApplicationController
  before_filter :require_user
  layout false
  
  def index
    @channels = Channel.all
    @messages = Message.all
  end
end
