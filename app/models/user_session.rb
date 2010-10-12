require "authlogic"

class UserSession < Authlogic::Session::Base
  # X-Session-ID is the Juggernaut client's sessionID
  # It's passed in the Ajax request from SuperRPC
  def session_id
    controller.request.headers["X-Session-ID"]
  end  
end