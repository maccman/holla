class MessagesController < ApplicationController
  before_filter :require_user
  
  def create
    message = Message.new(params)
    message.name = current_user
    message.save!
    head :ok
  end
end