package com.cryptonex.service;

import com.cryptonex.exception.WalletException;
import com.cryptonex.model.Order;
import com.cryptonex.model.User;
import com.cryptonex.model.Wallet;


import java.math.BigDecimal;

public interface WalletService {


    Wallet getUserWallet(User user) throws WalletException;

    public Wallet addBalanceToWallet(Wallet wallet, Long money) throws WalletException;

    public Wallet findWalletById(Long id) throws WalletException;

    public Wallet walletToWalletTransfer(User sender,Wallet receiverWallet, Long amount) throws WalletException;

    public Wallet payOrderPayment(Order order, User user) throws WalletException;



}
