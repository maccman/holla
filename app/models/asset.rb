class Asset < CarrierWave::Uploader::Base
  storage :file
  
  class << self
    def find(id)
      self.new.tap do |rec|
        rec.retrieve_from_store!(id)
      end
    end
    
    def create(file)
      file = CarrierWave::SanitizedFile.new(file)
      self.new.tap do |rec|
        rec.store!({
          :tempfile => file,
          :filename => generate_name(file)
        })
      end
    end
    
    protected
      def generate_name(file)
        ActiveSupport::SecureRandom.hex(13)
      end
  end
    
  def store_dir
    File.join("system", "uploads")
  end
  
  def id
    filename
  end
  alias_method :to_s, :id

  def persisted?
    true
  end  
  
  extend ActiveModel::Naming
  include ActiveModel::Conversion
end