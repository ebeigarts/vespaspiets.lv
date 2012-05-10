module VespaSpiets
  class App < Sinatra::Base
    set :root, File.dirname(__FILE__)
    set :public_folder, "#{root}/public"
    # set :sessions, true
    # set :session_secret, "1389hgfw781239dasf"

    get "/" do
      # @oauth = Koala::Facebook::OAuth.new(348126495249042, "a26aa29841f5f43b5c32cb663184c966")
      # @access_token = @oauth.get_app_access_token
      @access_token = "348126495249042|57jpAVi0NRRcOBq4eSdGH8luzCk"
      @graph = Koala::Facebook::API.new(@access_token)
      @feed = @graph.get_connections("107178829336751", "feed").select do |entry|
        entry["type"] == "photo" && !entry.key?("application")
      end.first(3)
      erb :index
    end
  end
end