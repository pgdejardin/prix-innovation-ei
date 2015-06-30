package com.ei.buildit.ws;

import com.ei.buildit.chat.ChatMessage;
import com.ei.buildit.chat.ChatRoomHolder;
import org.atmosphere.config.service.*;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Collection;

@ManagedService(path = "/ws/chat/{room}")
public class Chat {

  private static final Logger logger = LoggerFactory.getLogger(Chat.class);

  private static final ChatRoomHolder cache = ChatRoomHolder.getInstance();

  @PathParam("room")
  private String chatroomName;

  @Ready(encoders = {ChatMessageListEncoder.class})
  public Collection<ChatMessage> onReady(final AtmosphereResource r) {
    logger.info("Browser {} connected.", r.uuid());
    return cache.getChatRoom(chatroomName).getMessages();
  }

  @Disconnect
  public void onDisconnect(final AtmosphereResourceEvent event) {
    if (event.isCancelled())
      logger.info("Browser {} unexpectedly disconnected", event.getResource().uuid());
    else if (event.isClosedByClient())
      logger.info("Browser {} closed the connection", event.getResource().uuid());
  }

  @Message(encoders = {ChatMessageEncoder.class}, decoders = {ChatMessageDecoder.class})
  public ChatMessage onMessage(final ChatMessage chatMessage) throws IOException {
    logger.info("{} just send {}", chatMessage.getAuthor(), chatMessage.getMessage());
    cache.putMessage(chatroomName, chatMessage);
    return chatMessage;
  }

}
