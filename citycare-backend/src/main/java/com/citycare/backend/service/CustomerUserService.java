package com.citycare.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.citycare.backend.domain.USER_ROLE;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.model.Technician;
import com.citycare.backend.model.Officer;
import com.citycare.backend.model.Head;
import com.citycare.backend.repository.CitizenRepository;
import com.citycare.backend.repository.TechnicianRepository;
import com.citycare.backend.repository.OfficerRepository;
import com.citycare.backend.repository.HeadRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomerUserService implements UserDetailsService {

    private final CitizenRepository citizenRepository;
    private final TechnicianRepository technicianRepository;
    private final OfficerRepository officerRepository;
    private final HeadRepository headRepository;

    private static final String TECHNICIAN_PREFIX = "tech_";
    private static final String OFFICER_PREFIX = "off_";
    private static final String HEAD_PREFIX = "head_";

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.startsWith(TECHNICIAN_PREFIX)) {
            String actualUsername = username.substring(TECHNICIAN_PREFIX.length());
            Technician tech = technicianRepository.findByEmail(actualUsername);
            if (tech != null) {
                return buildUserDetails(tech.getEmail(), tech.getPassword(), tech.getRole());
            }
        } else if (username.startsWith(OFFICER_PREFIX)) {
            String actualUsername = username.substring(OFFICER_PREFIX.length());
            Officer officer = officerRepository.findByEmail(actualUsername);
            if (officer != null) {
                return buildUserDetails(officer.getEmail(), officer.getPassword(), officer.getRole());
            }
        } else if (username.startsWith(HEAD_PREFIX)) {
            String actualUsername = username.substring(HEAD_PREFIX.length());
            Head head = headRepository.findByEmail(actualUsername);
            if (head != null) {
                return buildUserDetails(head.getEmail(), head.getPassword(), head.getRole());
            }
        } else {
            // Default: Citizen
            Citizen citizen = citizenRepository.findByEmail(username);
            if (citizen != null) {
                return buildUserDetails(citizen.getEmail(), citizen.getPassword(), citizen.getRole());
            }
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }

    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        if (role == null) {
            role = USER_ROLE.ROLE_CITIZEN; // default role
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.toString()));

        return new org.springframework.security.core.userdetails.User(email, password, authorities);
    }
}
