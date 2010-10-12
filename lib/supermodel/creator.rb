module SuperModel
  module Creator
    def self.included(base)
      base.class_eval do
        belongs_to :creator, :class_name => "User"
        set_callback :validate, :before, :set_creator, :on => :create
        validates_presence_of :creator_id
      end
    end 
    
    def current_user
      return unless UserSession.activated?
      session = UserSession.find
      session && session.user
    end
    
    def set_creator
      self.creator = current_user
    end
  end
end