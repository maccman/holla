module ActiveRecord
  module Creator
    def self.included(base)
      base.class_eval do
        belongs_to :creator, :class_name => "User"
        before_validation :set_creator, :on => :create
        validates_presence_of :creator_id
      end
    end 
    
    def set_creator
      return unless UserSession.activated?
      session      = UserSession.find
      user         = session && session.user
      self.creator = user
    end
  end
end