package com.ei.buildit.ws;

import com.ei.buildit.chat.ChatMessage;
import org.atmosphere.config.managed.Encoder;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;

public class ChatMessageEncoder implements Encoder<ChatMessage, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String encode(ChatMessage chatMessage) {
        try {
            return mapper.writeValueAsString(chatMessage);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
