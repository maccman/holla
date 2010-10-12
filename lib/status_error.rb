module StatusError
  def self.included(base)
    base.class_eval do
      rescue_from BaseStatusError, :with => Proc.new {|e| head(e.code) }
    end
  end
  
  class BaseStatusError < StandardError
    class_attribute :code
  end
  
  class UnauthorizedAccess < BaseStatusError
    self.code = :unauthorized
  end
  
  class ResourceNotFound < BaseStatusError
    self.code = :not_found
  end
end