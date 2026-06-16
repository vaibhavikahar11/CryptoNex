package com.cryptonex.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

import com.cryptonex.domain.USER_ROLE;
import com.cryptonex.domain.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") 	
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String fullName;
	private String email;
	private String mobile;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;
	
	private UserStatus status= UserStatus.PENDING;

	private boolean isVerified = false;

	@Embedded
	private TwoFactorAuth twoFactorAuth= new TwoFactorAuth();

	private String picture;
	
	 @Enumerated(EnumType.STRING)
	    private Gender gender; // New field added

	    private LocalDate dob; // Date of Birth

	    @Size(max = 255, message = "Address can be at most 255 characters")
	    private String address;

	    @Size(max = 100, message = "City can be at most 100 characters")
	    private String city;

	    @Size(max = 20, message = "Postcode can be at most 20 characters")
	    private String postcode;

	    @Size(max = 100, message = "Country can be at most 100 characters")
	    private String country;
	    
	    private String profilePhoto; 
	    
	    // New Fields
	    @Column(length = 50) // Adjust length as needed
	    private String theme;

	    @Enumerated(EnumType.STRING)
	    @Column(length = 10) // Adjust length as needed
	    private Mode mode;

	private USER_ROLE role= USER_ROLE.ROLE_USER;

	
	
	
	

}
