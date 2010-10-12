module SuperRPC
  class SuperRPCError < StandardError; end
  class UnknownKlass < SuperRPCError; end
  class UnknownMethod < SuperRPCError; end
  class Unauthorized < SuperRPCError; end
  
  def klasses
    @klasses ||= []
  end
  module_function :klasses
  
  def klasses=(value)
    @klasses = value
  end
  module_function :klasses=
  
  def call(message)
    unless klasses.include?(message[:klass])
      raise UnknownKlass, message[:klass]
    end
    
    message[:klass].constantize.rpc(message)    
  end
  module_function :call

  module Controller
    def self.included(base)
      base.class_eval do
        rescue_from SuperRPC::UnknownKlass, SuperRPC::UnknownMethod, :with => :rpc_not_found
        rescue_from SuperRPC::Unauthorized, :with => :rpc_unauthorized
      end
    end
    
    def rpc
      message = request.request_parameters
      render :json => SuperRPC.call(message)
    end
    
    def rpc_not_found
      head 404
    end
    
    def rpc_unauthorized
      head 401
    end
  end
    
  module Base
    def self.included(base)
      SuperRPC.klasses << base.name
      base.extend ClassMethods
    end
    
    module ClassMethods    
      def rpc(message)
        unless respond_to?(message[:method])
          raise SuperRPC::UnknownMethod, message[:method]
        end
      
        send(message[:method], *message[:args])
      end
    end
  end
  
  module Model
    def self.included(base)
      base.send :include, SuperRPC::Base
      base.send :extend, ClassMethods
    end
    
    def editable_by?(user)
      false
    end
    
    def destroyable_by?(user)
      editable_by?(user)
    end
    
    module ClassMethods
      def creatable_by?(user)
        !!user
      end
      
      def rpc(message)
        session = UserSession.find
        user    = session && session.user
            
        raise SuperRPC::Unauthorized unless user

        case message[:method].to_sym
        when :create
          raise SuperRPC::Unauthorized unless creatable_by?(user)
          create!(*message[:args])
        when :update
          record = find(message[:args][0])
          raise SuperRPC::Unauthorized unless record.editable_by?(user)
          record.update_attributes!(message[:args][1])
        when :destroy
          record = find(message[:args][0])
          raise SuperRPC::Unauthorized record.destroyable_by?(user)
          record.destroy
        else
          method = "rpc_#{message[:method]}"
          if respond_to?(method)
            send(method, *message[:args])
          else
            raise SuperRPC::Unauthorized
          end
        end
      end
    end
  end
end