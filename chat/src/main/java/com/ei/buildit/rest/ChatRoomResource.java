package com.ei.buildit.rest;

import com.ei.buildit.chat.ChatRoom;
import com.ei.buildit.chat.ChatRoomHolder;
import com.ei.buildit.chat.User;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collection;
import java.util.List;

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

  @GET
  @Path("/{room}/users")
  public Response getUsers(@PathParam("room") String room) {
    return Response.ok(cache.getUsers(room)).build();
  }

  @POST
  @Path("/{room}/user")
  public Response addUserToRoom(@PathParam("room") String room, User user) {
    cache.addUserToRoom(room, user);
    return Response.ok().build();
  }
}
