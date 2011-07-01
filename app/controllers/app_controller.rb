class AppController < ApplicationController
  before_filter :require_user
end
