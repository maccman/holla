module Blather
  class App < Server::Client    
    class Room
      class Client
        attr_reader :stream, :jid, :room
        
        def initialize(stream, room, nick = nil)
          @stream = stream
          @room   = room
          @jid    = stream.jid
          @nick   = nick
        end
                
        def room_jid
          val          = room.jid.dup
          val.resource = nick
          val
        end
        
        def write(stanza)
          self.stream.write(stanza)
        end
        
        def eql?(o)
          unless o.is_a?(self.class)
            raise "Cannot compare #{self.class} with #{o.class}"
          end

          o.jid == self.jid
        end
        alias_method :==, :eql?
      end
      
      class << self
        def rooms
          @rooms ||= {}
        end
                
        def find(jid)
          rooms[jid.stripped] ||= self.new(jid)
        end
      end
      
      attr_reader :jid, :clients, :messages
      
      def initialize(jid)
        @jid      = JID.new(jid).strip!
        @clients  = {}
        @messages = []
      end
      
      def add_client(stream, nick)
        unless @clients[stream.jid]
          client = Client.new(stream, self, nick)
          
          # Send delayed messages
          messages.each {|m| client.write(m) }
          
          presence = Stanza::Presence::MUCUser.new
          presence.affiliation = :member
          presence.role = :participant
          
          # Send existing members' presences to client
          clients.each_value {|c|
            presence.jid  = c.jid
            presence.from = c.room_jid
            client.write(presence)
          }
          
          # Send new client's presence to members
          presence.jid  = client.jid
          presence.from = client.room_jid
          write presence
          
          # Send new client's presence to client
          presence << Stanza::Presence::MUCUser::Status.new(110)
          presence << Stanza::Presence::MUCUser::Status.new(100)
          client.write(presence)
          
          @clients[stream.jid] = client
        end
      end
      
      def remove_client(stream)
        client = @clients.delete(stream.jid)  
        return unless client

        status       = Stanza::Presence::Status.new
        status.from  = client.room_jid
        status.state = :unavailable
        write status
      end
      
      def add_message(stream, stanza)
        client = @clients[stream.jid]
        return unless client
        
        message      = stanza.dup
        message.from = client.room_jid
        message.to   = nil

        write message

        message.delay = Time.now
        @messages << message        
      end
      
      def add_presence(stanza)
        client = @clients[stream.jid]
        return unless client
        
        presence      = stanza.dup
        message.from  = client.room_jid
        presence.to   = nil        

        write presence        
      end
            
      def write(stanza)
        clients.each {|c| c.write(stanza) }
      end
    end
        
    # Use xmpp federated login and dialback
    # to log people in.
    # TODO - initial stream stuff
    # TODO - make sure parser is correct
    
    # Observe ChannelActivity redis - broadcast any additions
    
    attr_accessor :jid, :nickname
    
    def initialize
    end
    
    def post_init
      super
    end
    
    def write(stanza)
      stanza.to = self.jid if stanza.is_a?(Stanza)
      super(stanza)
    end
    
    protected
      def handle_iq(stanza)
        write StanzaError.new(stanza, 'service-unavailable', :cancel).to_node
      end
    
      # Service Denies Access Because No Password Provided
      def handle_presence(stanza)
        room = Room.find(stanza.to)

        if stanza.unavailable?
          room.remove_client(self)
        elsif stanza.muc?
          room.add_client(self, stanza.to.resource)
        else
          room.add_presence(self, stanza)
        end
      end

      def handle_message(stanza)
        return unless stanza.groupchat?
        room = Room.fine(stanza.to)
        room.add_message(self, stanza)
      end
  end
end