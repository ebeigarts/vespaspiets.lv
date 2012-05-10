require 'rubygems'
require 'bundler/setup'

$:.unshift File.dirname(__FILE__)
require 'app'
run VespaSpiets::App.new
