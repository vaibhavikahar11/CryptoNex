package com.cryptonex.response;

import lombok.Data;

@Data
public class PaymentResponse {


        private String payment_url ;
        
        public PaymentResponse() {}

		public PaymentResponse(String payment_url) {
			super();
			this.payment_url = payment_url;
		}

		public String getPayment_url() {
			return payment_url;
		}

		public void setPayment_url(String payment_url) {
			this.payment_url = payment_url;
		}
        
        


}
