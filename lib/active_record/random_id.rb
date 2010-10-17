module ActiveRecord
  module RandomID
    def self.included(base)
      base.class_eval do
        before_create :set_default_id
        if column_names.include?("created_at")
          default_scope :order => "created_at ASC"
        end
      end
      base.extend ClassMethods
    end

    private
      def set_default_id
        self.id ||= ActiveSupport::SecureRandom.hex(13)
      end
    
    module ClassMethods
      def attributes_protected_by_default
        [ inheritance_column ]
      end
    end
  end
end