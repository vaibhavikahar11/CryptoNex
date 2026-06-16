# ⚡ Cryptonex – AI-Powered Crypto Trading Platform

**Live App:** [cryptonex-frontend.vercel.app](https://cryptonex-frontend.vercel.app/)
**Status:** 🚀 Production-Ready Prototype | 📈 Scalable Architecture

---

## 📝 Overview

Cryptonex is a **full-stack cryptocurrency trading platform** designed to replicate real-world crypto trading workflows while ensuring **bank-grade security**.
It combines **financial technology**, **real-time data processing**, and **AI-driven market insights** into a single, modern web application.

This project was built to:

* **Demonstrate my ability** to build end-to-end scalable applications using **Java Spring Boot**, **React**, and **secure API integrations**.
* Solve **realistic fintech challenges** such as multi-gateway payments, portfolio management, and secure authentication.
* Deploy a **production-ready, cloud-hosted application** that works seamlessly from UI to database.

---

## 🎯 Key Highlights

* **AI Chatbot Integration** – Real-time crypto data queries using **Gemini API** & **CoinGecko API**.
* **Full Trading Flow** – Buy, sell, and track cryptocurrencies with instant portfolio updates.
* **Advanced Wallet Operations** – Wallet-to-wallet transfers, bank withdrawals, and balance top-ups.
* **2FA & OTP Security** – Secured authentication with **Spring Security** and email-based OTP.
* **Dual Payment Gateways** – Integrated **Razorpay** & **Stripe** for flexible transactions.

---

## 🖥 Tech Stack

| Layer          | Technologies                                                   |
| -------------- | -------------------------------------------------------------- |
| **Frontend**   | React, Tailwind CSS, Redux, Axios, React Router DOM, Shadcn UI |
| **Backend**    | Java, Spring Boot, MySQL, Spring Security, Java Mail Sender    |
| **Payments**   | Razorpay, Stripe                                               |
| **APIs**       | Gemini API, CoinGecko API                                      |
| **Deployment** | Vercel (Frontend), Local/Cloud Server (Backend)                |

---

## 🏗 Architecture Diagram

```
[ React Frontend ] <---- Axios ----> [ Spring Boot API ] <----> [ MySQL DB ]
        |                                    |
        ↓                                    ↓
 [ Gemini API / CoinGecko API ]       [ Payment Gateways ]
```

---

## 📂 Core Features

### 💬 AI Chatbot – "Crypto Assistant"

* Handles natural crypto-related queries like *"BTC price today"*
* Fetches market data & historical trends instantly
* Powered by Gemini & CoinGecko APIs

### 📊 Trading & Portfolio

* Buy & Sell interface with live rates
* Performance tracking with visual stats
* Auto-refreshing portfolio balances

### 💳 Wallet & Payments

* Secure wallet-to-wallet transfers
* Withdraw to bank accounts
* Add balance using Razorpay or Stripe

### 🔐 Authentication & Security

* Login/Register via **Spring Security**
* 2FA using OTP verification
* Forgot Password flow with email link

---

## 🚀 Quick Start

### 1️⃣ Clone the repository

```bash
git clone https://github.com/shivam-jondhale/CryptoNex
```

### 2️⃣ Backend Setup

```bash
cd Cryptonex-Backend-master
mvn clean install
mvn spring-boot:run
```

* Update `application.properties` with:

  * MySQL credentials
  * API keys for Gemini & CoinGecko
  * Razorpay & Stripe keys

### 3️⃣ Frontend Setup

```bash
cd Cryptonex-Frontend-main
npm install
npm run dev
```

* Add `.env` file with:

  * Backend API URL
  * Payment gateway keys

---


## 🛠 Challenges Solved

* **Real-Time Data Handling:** Optimized API calls to refresh prices without overloading APIs.
* **State Management:** Used Redux to sync data between trading, wallet, and portfolio modules.
* **Payment Reliability:** Built a dual-gateway payment system to ensure uptime.
* **Security:** Enforced 2FA for sensitive wallet and bank transactions.

---

## 🎯 Why This Project Stands Out

* Shows **full-stack expertise** with both frontend and backend development.
* Demonstrates **fintech problem-solving skills** in authentication, payments, and data handling.
* Fully deployed demo accessible from anywhere.
* Reflects **production-grade coding practices** and **scalable architecture**.

---


## 👑 Admin Access for Testing

A default **Admin account** is pre-configured for demo and testing purposes.
Use these credentials to log in and explore administrative functionality.

**Test Admin Credentials**

| Field        | Value                    |
| ------------ | ------------------------ |
| **Username** | `vaibhavikahar11@gmail.com` |
| **Password** | `Vaibhavi123`               |

**Admin Permissions**

* ✅ Approve or reject **withdrawal requests**.
  
  

> ⚠ **Security Note:**
> These credentials are for **demo/testing purposes only**.
> In production environments, always:
>
> * Change default passwords immediately.
> * Enforce **strong password policies** and **Two-Factor Authentication (2FA)**.

---




## 📜 License

MIT License – You are free to explore and adapt.

---

## 📢 Author

**Vaibhavi Kahar**
📧 [vaibhavikahar11@gmail.com](mailto:vaibhavikahar11@gmail.com)
💼 [GitHub](https://github.com/vaibhavikahar11)


