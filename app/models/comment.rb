class Comment < ActiveRecord::Base
  include ActiveRecord::Creator
  
  validates_presence_of :body, :klass, :klass_id
      
  delegate :name, :to => :instance, :prefix => true
  delegate :name, :to => :creator, :prefix => true
  
	def instance=(instance)
	  self.klass    = instance.class.name
	  self.klass_id = instance.id
	end
	
  def instance
    @instance ||= klass.constantize.find(klass_id)
  end
end
