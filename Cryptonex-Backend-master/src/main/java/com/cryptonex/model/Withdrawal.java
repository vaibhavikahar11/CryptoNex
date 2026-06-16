package com.cryptonex.model;

import com.cryptonex.domain.WithdrawalStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Withdrawal {
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long id;

    private WithdrawalStatus status;

    private Long amount;

    @ManyToOne
    private User user;

    private LocalDateTime date;
    
    public Withdrawal() {}

	public Withdrawal(Long id, WithdrawalStatus status, Long amount, User user, LocalDateTime date) {
		super();
		this.id = id;
		this.status = status;
		this.amount = amount;
		this.user = user;
		this.date = date;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public WithdrawalStatus getStatus() {
		return status;
	}

	public void setStatus(WithdrawalStatus status) {
		this.status = status;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}
    
    
}
