require 'sinatra'
require 'dalli'
require 'feedjira'
require 'sanitize'

module VespaSpiets
  class App < Sinatra::Base
    set :cache, Dalli::Client.new
    set :root, File.dirname(__FILE__)
    set :public_folder, "#{root}/public"
    # set :sessions, true
    # set :session_secret, "1389hgfw781239dasf"

    before do
      @feed = settings.cache.fetch("feed", 60) do
        Feedjira::Feed.fetch_and_parse("https://vespaspiets.wordpress.com/feed/")
      end
    end

    get "/" do
      if request.host == "www.vespaclub.lv"
        redirect "http://www.vespaspiets.lv/"
      else
        erb :index
      end
    end

    get %r{^/blog/(.*)$} do |url|
      @entry = @feed.entries.detect { |e| e.url.include?(url) }
      if @entry
        erb :post, :layout => false
      else
        halt 404
      end
    end
  end
end
