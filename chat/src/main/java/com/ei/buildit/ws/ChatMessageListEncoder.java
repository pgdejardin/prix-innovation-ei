package com.ei.buildit.ws;

import com.ei.buildit.chat.ChatMessage;
import org.atmosphere.config.managed.Encoder;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.Collection;

public class ChatMessageListEncoder implements Encoder<Collection<ChatMessage>, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String encode(Collection<ChatMessage> chatMessages) {
        try {
            return mapper.writeValueAsString(chatMessages);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
