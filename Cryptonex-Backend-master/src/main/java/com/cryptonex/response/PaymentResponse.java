package com.cryptonex.response;

import lombok.Data;

@Data
public class PaymentResponse {

        private String payment_url;

        // Razorpay Order fields — used for Checkout.js modal with UPI QR
        private String razorpay_order_id;
        private String razorpay_key;
        private Long   razorpay_amount;       // in paise
        private String razorpay_currency;
        private String razorpay_name;
        private String razorpay_description;
        private String razorpay_prefill_email;

        // Internal DB ID of the PaymentOrder
        private Long payment_order_id;

        public PaymentResponse() {}

        public PaymentResponse(String payment_url) {
            this.payment_url = payment_url;
        }

        public String getPayment_url()              { return payment_url; }
        public void   setPayment_url(String v)      { this.payment_url = v; }

        public String getRazorpay_order_id()            { return razorpay_order_id; }
        public void   setRazorpay_order_id(String v)    { this.razorpay_order_id = v; }

        public String getRazorpay_key()                 { return razorpay_key; }
        public void   setRazorpay_key(String v)         { this.razorpay_key = v; }

        public Long   getRazorpay_amount()              { return razorpay_amount; }
        public void   setRazorpay_amount(Long v)        { this.razorpay_amount = v; }

        public String getRazorpay_currency()            { return razorpay_currency; }
        public void   setRazorpay_currency(String v)    { this.razorpay_currency = v; }

        public String getRazorpay_name()                { return razorpay_name; }
        public void   setRazorpay_name(String v)        { this.razorpay_name = v; }

        public String getRazorpay_description()         { return razorpay_description; }
        public void   setRazorpay_description(String v) { this.razorpay_description = v; }

        public String getRazorpay_prefill_email()           { return razorpay_prefill_email; }
        public void   setRazorpay_prefill_email(String v)   { this.razorpay_prefill_email = v; }

        public Long getPayment_order_id()                   { return payment_order_id; }
        public void setPayment_order_id(Long v)             { this.payment_order_id = v; }
}
