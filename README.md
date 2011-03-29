#Intro

Holla is a group chat app. The UI is built in a RIA fashion - i.e. is totally asynchronous and super fast. I've open sourced it for a book I'm writing on building Rich Internet Applications with JavaScript.

Good examples for:

* CSS3 theming (inspired by http://jquerymobile.com)
* Spine.js JS frontend
* Less
* Sprockets
* Juggernaut 2
* Async uploads with progress

![Screenshot](https://lh4.googleusercontent.com/_IH1OempnqUc/TZF1gMnidmI/AAAAAAAABKE/b9rp9RdtA3o/s800/Screen%20shot%202011-03-29%20at%2018.58.12.png)

# Prerequisites

* Ruby 1.9.2
* Bundler
* Redis
* Mysql

# Installation

* bundle install
* rake db:create
* cat db/development_structure.sql | rails dbconsole
* rails server thin
* start the Juggernaut server - [http://github.com/maccman/juggernaut](http://github.com/maccman/juggernaut)

Now go to [http://localhost:3000](http://localhost:3000)