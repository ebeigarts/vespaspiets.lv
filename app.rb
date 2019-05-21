require 'sinatra'
require 'dalli'
require 'feedjira'
require 'sanitize'
require 'nokogiri'
require 'open-uri'
require 'json'

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

    get "/albums.json" do
      albums = settings.cache.fetch("albums", 60) do
        html = open("https://mobile.facebook.com/pg/vespaspiets/photos/?tab=albums", {
          'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
        })
        doc = Nokogiri::HTML(html, nil, Encoding::UTF_8.to_s)
        doc.search('//*[@id="pages_msite_body_contents"]/div/div[2]/div/a').map do |a|
          # https://mathiasbynens.be/notes/css-escapes
          css_escaped_image_url = a.at("i")["style"].match(/url\('([^']+)/)[1]
          image_url = css_escaped_image_url.gsub(/\\[^\s]+\ /) { |m| m[1..-2].to_i(16).chr }
          {
            url: "https://www.facebook.com#{a['href']}",
            image_url: image_url,
            name: a.at("div/div[2]/div[1]").text
          }
        end
      end
      content_type :json
      albums.
        reject { |a| a[:name] == "Profila attēli" }.
        reject { |a| a[:name] == "Titulbildes" }.
        to_json
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
