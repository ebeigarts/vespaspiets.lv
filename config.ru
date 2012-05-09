require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'koala'

$:.unshift File.dirname(__FILE__)
require 'app'
run VespaSpiets::App.new
