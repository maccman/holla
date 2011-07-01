class AppController < ApplicationController
  before_filter :require_user
#  layout false
end
