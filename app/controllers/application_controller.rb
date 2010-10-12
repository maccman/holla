class ApplicationController < ActionController::Base  
  protect_from_forgery
  layout "application"
  
  helper_method :current_user_session, :current_user, :logged_in?

  protected
    def current_user_session
      return @current_user_session if defined?(@current_user_session)
      @current_user_session = UserSession.find
    end

    def current_user
      return @current_user if defined?(@current_user)
      @current_user = current_user_session && current_user_session.user
    end
    
    def logged_in?
      !!current_user
    end
    
    def require_user
      unless current_user
        respond_to do |format|
          format.html  { 
            store_location
            flash[:error] = "You must be logged in to access this page"
            redirect_to new_user_session_url          
          }
          format.all { 
            head(:unauthorized)
          }
        end
        return false
      end
    end
    
    def store_location
      session[:return_to] = request.fullpath
    end
    
    def redirect_back_or_default(default)
      return_to = session[:return_to] || params[:return_to]
      redirect_to(return_to.present? ? return_to : default)
      session[:return_to] = nil
    end 
end