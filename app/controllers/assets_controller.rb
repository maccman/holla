class AssetsController < ActionController::Metal
  def update
    @asset = Asset.find(request.path_parameters[:id])
    
    if request.get?
      self.location = @asset.data.expiring_url(1.hour)
      head 302
      
    else    
      if @asset.uploaded?
        head(401)
        return
      end
    
      data = request.body
      data.original_filename = @asset.name
    
      @asset.data = data
      @asset.save!
    
      head 200
    end
  end
  
  private
    def head(status)
      self.status = status
      self.response_body = " "
    end
end

# Jump through some Paperclip hoops
class Tempfile
  attr_accessor :original_filename
  
  def original_filename
    @original_filename ||= "tempfile"
  end
end