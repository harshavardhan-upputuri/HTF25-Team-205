package com.citycare.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.citycare.backend.domain.USER_ROLE;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.model.Officer;
import com.citycare.backend.model.Head;
import com.citycare.backend.model.Technician;
import com.citycare.backend.model.VerificationCode;
import com.citycare.backend.repository.CitizenRepository;
import com.citycare.backend.repository.OfficerRepository;
import com.citycare.backend.repository.HeadRepository;
import com.citycare.backend.repository.TechnicianRepository;
import com.citycare.backend.repository.VerificationCodeRepository;
import com.citycare.backend.config.JwtProvider;
import com.citycare.backend.utils.OtpUtil;
import com.citycare.backend.request.LoginRequest;
import com.citycare.backend.request.SignupRequest;
import com.citycare.backend.response.AuthResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CitizenRepository citizenRepo;
    private final TechnicianRepository technicianRepo;
    private final OfficerRepository officerRepo;
    private final HeadRepository headRepo;
    private final VerificationCodeRepository verificationRepo;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ----------------- SIGNUP (CITIZEN) -----------------
    public AuthResponse signUp(SignupRequest req) throws Exception {
        VerificationCode vc = verificationRepo.findByEmail(req.getEmail());
        if (vc == null || !vc.getOtp().equals(req.getOtp())) {
            throw new Exception("Invalid OTP");
        }

        Citizen existing = citizenRepo.findByEmail(req.getEmail());
        if (existing != null) {
            throw new Exception("Citizen already exists");
        }

        Citizen citizen = new Citizen();
        citizen.setName(req.getName());
        citizen.setEmail(req.getEmail());
        citizen.setPassword(passwordEncoder.encode(req.getPassword()));
        citizen.setPhone(req.getPhone());
        citizen.setRole(USER_ROLE.ROLE_CITIZEN);
        citizenRepo.save(citizen);

        // generate JWT
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CITIZEN.toString()));
        Authentication auth = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = jwtProvider.generateJwtToken(auth);
        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setRole(USER_ROLE.ROLE_CITIZEN);
        res.setMessage("Citizen created successfully");
        return res;
    }

    // ----------------- LOGIN -----------------
    public AuthResponse signIn(LoginRequest req) throws Exception {
        String email = req.getEmail();
        String password = req.getPassword();
        String otp = req.getOtp();

        Authentication authentication;

        if (otp != null && !otp.isEmpty()) {
            authentication = authenticateWithOtp(email, otp);
        } else if (password != null && !password.isEmpty()) {
            authentication = authenticateWithPassword(email, password);
        } else {
            throw new Exception("Provide either password or OTP");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateJwtToken(authentication);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("Login success");

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        res.setRole(USER_ROLE.valueOf(roleName));

        return res;
    }

    private Authentication authenticateWithOtp(String email, String otp) throws Exception {
        VerificationCode vc = verificationRepo.findByEmail(email);
        if (vc == null || !vc.getOtp().equals(otp)) {
            throw new Exception("Invalid OTP");
        }

        // Determine user type by email
        Object user = findUserByEmail(email);
        if (user == null)
            throw new BadCredentialsException("User not found");

        USER_ROLE role = getRole(user);
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.toString()));
        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }

    private Authentication authenticateWithPassword(String email, String password) {
        Object user = findUserByEmail(email);
        if (user == null)
            throw new BadCredentialsException("User not found");

        String dbPassword = getPassword(user);
        if (!passwordEncoder.matches(password, dbPassword)) {
            throw new BadCredentialsException("Invalid password");
        }

        USER_ROLE role = getRole(user);
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.toString()));
        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }

    // ----------------- SEND LOGIN OTP -----------------
    public void sendLoginOtp(String email, USER_ROLE role) throws Exception {
        VerificationCode existing = verificationRepo.findByEmail(email);
        if (existing != null)
            verificationRepo.delete(existing);

        String otp = OtpUtil.generateOtp();
        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setOtp(otp);
        vc.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        verificationRepo.save(vc);

        // send email logic (implement your EmailService)

        String subject = "Your OTP for Login/Signup - City Care";

        String text = "Dear User,\n\n"
                + "Thank you for using our City Care service.\n\n"
                + "Your One-Time Password (OTP) for login/signup is: " + otp + "\n\n"
                + "⚠️ Please do not share this OTP with anyone.\n"
                + "This code is valid for the next 5 minutes.\n\n"
                + "Best Regards,\n"
                + "City Care Team";

        emailService.sendVerificationOtpEmail(email, otp, subject, text);
    }

    // ----------------- HELPERS -----------------
    private Object findUserByEmail(String email) {
        if ((citizenRepo.findByEmail(email)) != null)
            return citizenRepo.findByEmail(email);
        if ((technicianRepo.findByEmail(email)) != null)
            return technicianRepo.findByEmail(email);
        if ((officerRepo.findByEmail(email)) != null)
            return officerRepo.findByEmail(email);
        if ((headRepo.findByEmail(email)) != null)
            return headRepo.findByEmail(email);
        return null;
    }

    private String getPassword(Object user) {
        if (user instanceof Citizen)
            return ((Citizen) user).getPassword();
        if (user instanceof Technician)
            return ((Technician) user).getPassword();
        if (user instanceof Officer)
            return ((Officer) user).getPassword();
        if (user instanceof Head)
            return ((Head) user).getPassword();
        return null;
    }

    private USER_ROLE getRole(Object user) {
        if (user instanceof Citizen)
            return USER_ROLE.ROLE_CITIZEN;
        if (user instanceof Technician)
            return USER_ROLE.ROLE_TECHNICIAN;
        if (user instanceof Officer)
            return USER_ROLE.ROLE_OFFICER;
        if (user instanceof Head)
            return USER_ROLE.ROLE_HEAD;
        return null;
    }
}
