package com.citycare.backend.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueRequest {
    private String title;
    private String description;
    private String issueType;

    // Address fields
    private String addressName;
    private String locality;
    private String streetAddress;
    private String city;
    private String state;
    private String pinCode;
    private String mobile;

      private Double latitude;  // <--- added
    private Double longitude;
    private List<String> imageUrls; // Cloudinary URLs

    // getters & setters
}
