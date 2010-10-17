module ActiveModel
  module SerializeOptions
    class Options
      def initialize
        @options = {}
      end

      %w( only except methods ).each do |method|
        class_eval(<<-EOS, __FILE__, __LINE__ + 1)
          def #{method}(*args)
            @options[:#{method}] ||= []
            @options[:#{method}] |= args
          end
        EOS
      end
      
      # We do not want to override include
      def includes(*args)
        @options[:include] ||= []
        @options[:include] |= args
      end

      def merge(opts = nil)
        options = @options.dup
        (opts || {}).each do |key, value|
          options[key] ||= []
          options[key] |= Array(value)
        end
        options
      end

      def replace(opts)
        @options.replace(opts)
      end
    end

    module Model
      def self.included(base)
        base.send :include, InstanceMethods
        base.send :extend,  ClassMethods
      end
    end

    module InstanceMethods
      def serializable_hash(options = nil)
        options = self.class.serialize_options.merge(options)
        super(options)
      end
    end

    module ClassMethods
      def serialize_options(&block)
        @serialize_options ||= Options.new
        @serialize_options.instance_eval(&block) if block_given?
        @serialize_options
      end

      def serialize_options=(options)
        @serialize_options ||= Options.new
        @serialize_options.replace(options)
      end
    end
  end
end