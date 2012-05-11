require 'sinatra'
require 'dalli'
require 'feedzirra'
require 'sanitize'

module VespaSpiets
  class App < Sinatra::Base
    set :cache, Dalli::Client.new
    set :root, File.dirname(__FILE__)
    set :public_folder, "#{root}/public"
    # set :sessions, true
    # set :session_secret, "1389hgfw781239dasf"

    get "/" do
      @feed = Feedzirra::Feed.fetch_and_parse("http://vespaspiets.wordpress.com/feed/")
      erb :index
    end
  end
end