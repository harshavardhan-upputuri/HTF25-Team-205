package com.citycare.backend.utils;

import java.util.Random;

public class OtpUtil {
    
    public static String generateOtp(){
        Random random= new Random();
        int otplength=6;

        StringBuilder otp=new StringBuilder(otplength);

        for(int i=0;i<otplength;i++){
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }
}
