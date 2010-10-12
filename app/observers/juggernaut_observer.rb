class JuggernautObserver < ActiveModel::Observer
  observe :roster, :channel_activity
    
  def after_create(rec)
    publish(:create, rec)
  end
  
  def after_update(rec)
    publish(:update, rec)
  end
  
  def after_destroy(rec)
    publish(:destroy, rec)
  end
  
  protected
    def publish(type, rec)
      Juggernaut.publish(
        Array(rec.observer_clients).map {|c| "/observer/#{c}" }, 
        {
          :type  => type, :id => rec.id, 
          :klass => rec.class.name, :record => rec
        },
        :except => current_session_id
      )
    end
    
    # The client's current Juggernaut sessionID.
    # We don't want messages generated from clients
    # to be send back to those clients.
    def current_session_id
      return unless UserSession.activated?
      session = UserSession.find
      session && session.session_id
    end
end