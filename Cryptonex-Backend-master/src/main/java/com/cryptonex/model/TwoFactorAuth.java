package com.cryptonex.model;

import com.cryptonex.domain.VerificationType;
import lombok.Data;
import jakarta.persistence.Embeddable;

@Data
@Embeddable
public class TwoFactorAuth {

    private boolean isEnabled = false;
    private VerificationType sendTo;
    
    public TwoFactorAuth() {}

	public boolean isEnabled() {
		return isEnabled;
	}

	public void setEnabled(boolean isEnabled) {
		this.isEnabled = isEnabled;
	}

	public VerificationType getSendTo() {
		return sendTo;
	}

	public void setSendTo(VerificationType sendTo) {
		this.sendTo = sendTo;
	}
    
    
}
