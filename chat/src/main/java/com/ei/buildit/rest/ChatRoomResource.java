package com.ei.buildit.rest;

import com.ei.buildit.chat.ChatRoom;
import com.ei.buildit.chat.ChatRoomHolder;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

@Path("/chat-room")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ChatRoomResource {
    private static final ChatRoomHolder cache = ChatRoomHolder.getInstance();

    @GET
    public Collection<ChatRoom> getRooms() {
        return cache.getRooms();
    }

    @PUT
    @Path("/{room}")
    public void createRoom(@PathParam("room") String room) {
        cache.createRoom(room);
    }

}
