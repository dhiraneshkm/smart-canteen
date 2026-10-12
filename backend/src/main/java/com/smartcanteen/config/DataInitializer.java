package com.smartcanteen.config;

import com.smartcanteen.entity.Role;
import com.smartcanteen.entity.User;
import com.smartcanteen.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure Admin Account
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@smartcanteen.edu",
                    passwordEncoder.encode("Password@123"),
                    "Campus Canteen Administrator",
                    "+91 9876543201",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
        }

        // Ensure Kitchen Staff Account
        if (!userRepository.existsByUsername("kitchen")) {
            User kitchen = new User(
                    "kitchen",
                    "kitchen@smartcanteen.edu",
                    passwordEncoder.encode("Password@123"),
                    "Main Kitchen Head Chef",
                    "+91 9876543202",
                    Role.ROLE_KITCHEN_STAFF
            );
            userRepository.save(kitchen);
        }

        // Ensure Student Account
        if (!userRepository.existsByUsername("student")) {
            User student = new User(
                    "student",
                    "student@smartcanteen.edu",
                    passwordEncoder.encode("Password@123"),
                    "Aarav Sharma",
                    "+91 9876543203",
                    Role.ROLE_STUDENT
            );
            userRepository.save(student);
        }

        if (!userRepository.existsByUsername("student2")) {
            User student2 = new User(
                    "student2",
                    "priya.verma@smartcanteen.edu",
                    passwordEncoder.encode("Password@123"),
                    "Priya Verma",
                    "+91 9876543204",
                    Role.ROLE_STUDENT
            );
            userRepository.save(student2);
        }
    }
}
