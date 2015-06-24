package com.ei.buildit.ws;

import com.ei.buildit.chat.ChatMessage;
import org.atmosphere.config.managed.Decoder;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;

public class ChatMessageDecoder implements Decoder<String, ChatMessage> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public ChatMessage decode(String s) {
        try {
            return mapper.readValue(s, ChatMessage.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
