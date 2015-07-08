package com.ei.buildit.chat;

/**
 * Created on 30/06/2015
 */
public class User {

  private String uuid;

  private String username;

  private Double latitude;

  private Double longitude;

  public User() {
  }

  public User(String uuid) {
    this.uuid = uuid;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public Double getLatitude() {
    return latitude;
  }

  public void setLatitude(Double latitude) {
    this.latitude = latitude;
  }

  public Double getLongitude() {
    return longitude;
  }

  public void setLongitude(Double longitude) {
    this.longitude = longitude;
  }

  @Override
  public boolean equals(Object user) {
    return user instanceof User && this.getUuid().equals(((User) user).getUuid());
  }

  public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }
}
