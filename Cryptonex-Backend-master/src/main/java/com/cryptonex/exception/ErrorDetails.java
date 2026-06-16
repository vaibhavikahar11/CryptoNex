package com.cryptonex.exception;


import java.time.LocalDateTime;


public class ErrorDetails {
	
	private String error;
	private String message;
	private LocalDateTime timestamp;
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
	public ErrorDetails(String error, String message, LocalDateTime timestamp) {
		super();
		this.error = error;
		this.message = message;
		this.timestamp = timestamp;
	}

	public ErrorDetails() {}
}
