var Rails = {};

jQuery(function($){
  Rails.crsf_token = $('meta[name=csrf-token]').attr('content');
  Rails.csrf_param = $('meta[name=csrf-param]').attr('content');
  Rails.user_id    = $('meta[name=user-id]').attr('content');
  Rails.app_site   = $('meta[name=app-site]').attr('content');
  Rails.app_domain = $('meta[name=app-domain]').attr('content');
});