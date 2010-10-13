# Intro

Holla is a group chat app. The UI is built in a RIA fashion - i.e. is totally asynchronous and super fast.
I've open sourced it for a book I'm writing on building Rich Internet Applications with JavaScript.

Try it out in your browser (Chrome optimized) - [http://getholla.com](http://getholla.com)

![Screenshot](http://cl.ly/2PNL/content)

# Prerequisites

* Ruby 1.9.2
* Bundler
* Redis

# Installation

* bundle install
* rake db:setup
* start redis
* rails thin server
* start the Juggernaut server - [http://github.com/maccman/juggernaut](http://github.com/maccman/juggernaut)