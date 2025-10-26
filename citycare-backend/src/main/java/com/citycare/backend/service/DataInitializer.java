package com.citycare.backend.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.citycare.backend.domain.USER_ROLE;
import com.citycare.backend.model.Head;
import com.citycare.backend.repository.HeadRepository;

import lombok.RequiredArgsConstructor;
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final HeadRepository headRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if(headRepo.count() == 0){
            Head head = new Head();
            head.setName("HarshaHead");
            head.setEmail("nikkiharshunikki@gmail.com");
            head.setPhone("1234567890");
            head.setPassword(passwordEncoder.encode("harshaupputuri"));
            head.setRole(USER_ROLE.ROLE_HEAD);
            headRepo.save(head);
        }
    }
}
