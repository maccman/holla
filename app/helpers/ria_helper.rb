module RiaHelper
  def user_id_meta_tag
    logged_in? ? meta_tag("user-id", current_user.id) : ""
  end
  
  def app_name_meta_tag
    meta_tag("app_name", AppConfig.app_name)
  end
  
  def app_site_meta_tag
    meta_tag("app-site", AppConfig.app_site)
  end
  
  def app_domain_meta_tag
    meta_tag("app-domain", AppConfig.app_domain)
  end
  
  def application_meta_tag
    user_id_meta_tag + 
    app_name_meta_tag + 
    app_site_meta_tag + 
    app_domain_meta_tag
  end
  
  protected
    def meta_tag(name, value)
      %(<meta name="#{name}" content="#{Rack::Utils.escape_html(value)}"/>).html_safe    
    end
end
