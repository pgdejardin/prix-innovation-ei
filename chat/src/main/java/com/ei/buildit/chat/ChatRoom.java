package com.ei.buildit.chat;

import org.codehaus.jackson.annotate.JsonIgnore;

import javax.xml.bind.annotation.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
public class ChatRoom implements Serializable {

    private String name;

    private List<ChatMessage> messages =  new ArrayList<>();

    public ChatRoom() {
    }

    public ChatRoom(String name) {
        this.name = name;
    }

    @XmlID
    @XmlElement
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonIgnore
    @XmlTransient
    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

}
