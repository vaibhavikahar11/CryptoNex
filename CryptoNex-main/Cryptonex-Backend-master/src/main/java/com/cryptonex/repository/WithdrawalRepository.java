package com.cryptonex.repository;

import com.cryptonex.domain.WithdrawalStatus;
import com.cryptonex.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WithdrawalRepository extends JpaRepository<Withdrawal,Long> {
    List<Withdrawal> findByUserId(Long userId);
}
