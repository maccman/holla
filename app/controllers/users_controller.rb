class UsersController < ApplicationController
  before_filter :require_user, :except => [:new, :create, :avatar]
  before_filter :find_user, :only => [:current, :edit, :update]
  respond_to :json, :html
  layout "backend"
  
  def index
    flash.keep
    redirect_to :controller => "ria"
  end
  
  def current
    respond_with(@user) do |wants|
      wants.html { render :action => "edit" }
    end
  end
  
  def new
    @user = current_user || User.new
  end
  
  def create    
    @user = User.new(params[:user])
    @user.save!
    
    UserSession.create(@user)
    flash[:notice] = "Thanks for signing up!"
    
    redirect_back_or_default :action => "index"
  rescue ActiveRecord::RecordInvalid
    render :action => :new
  end
  
  def edit
  end
  
  def show
    @user = User.find(params[:id])
    respond_with(@user) do |wants|
      wants.html { render :action => "edit" }
    end
  end
  
  def update
    @user.update_attributes!(params[:user])
    flash[:notice] = "Successfully updated"
    
    # For users signing up using user_credentials
    UserSession.create(@user)
    
    redirect_to :action => "edit"
  rescue ActiveRecord::RecordInvalid
    render :action => :edit
  end
  
  def avatar
    @user = User.find(params[:id])
    redirect_to @user.avatar.url(:thumb)
  end
  
  private
    def find_user
      @user = current_user
    end
    
    # For AuthLogic single_access
    def single_access_allowed?
      true
    end
end
