package com.ei.buildit.chat;

import com.google.common.base.Predicate;
import com.google.common.collect.FluentIterable;

import java.util.*;

public class ChatRoomHolder {

  private static ChatRoomHolder instance = null;

  private ChatRoomHolder() {
    // Exists only to defeat instantiation.
  }

  public static ChatRoomHolder getInstance() {
    if (instance == null) {
      instance = new ChatRoomHolder();
    }
    return instance;
  }

  Map<String, ChatRoom> chatRoom = new HashMap<>();

  public ChatRoom getChatRoom(String roomName) {
    return chatRoom.get(roomName);
  }

  public Collection<ChatRoom> getRooms() {
    return chatRoom.values();
  }

  public void putMessage(String roomName, ChatMessage message) {
    ChatRoom room = getChatRoom(roomName);
    if (room == null) {
      room = new ChatRoom(roomName);
      chatRoom.put(roomName, room);
    }
    room.getMessages().add(message);
  }

  public void createRoom(String roomName) {
    ChatRoom room = getChatRoom(roomName);
    if (room == null) {
      room = new ChatRoom(roomName);
      chatRoom.put(roomName, room);
    } else {
      throw new IllegalArgumentException("Already existing chatroom : " + roomName);
    }
  }

  public List<User> getUsers(String roomName) {
    ChatRoom chatRoom = getChatRoom(roomName);
    if (chatRoom != null) {
      return chatRoom.getUsers();
    }
    return new ArrayList<>();
  }

  public void addUserToRoom(String roomName, User user) {
    ChatRoom chatRoom = getChatRoom(roomName);
    if (chatRoom != null) {
      chatRoom.getUsers().add(user);
    }
  }

  public void removeUserToRoom(String roomName, String uuid) {
    ChatRoom chatRoom = getChatRoom(roomName);
    if (chatRoom != null) {
      chatRoom.getUsers().remove(new User(uuid));
    }
  }

  public void updateUserGeoloc(String room, final User user) throws IllegalStateException {
    ChatRoom chatRoom = getChatRoom(room);
    if (chatRoom != null) {
      User userFromList = FluentIterable
        .from(chatRoom.getUsers())
        .filter(new Predicate<User>() {
          @Override
          public boolean apply(User input) {
            return input.equals(user);
          }
        })
        .first()
        .get();
      userFromList.setLatitude(user.getLatitude());
      userFromList.setLongitude(user.getLongitude());
    }
  }
}
