package com.smartcanteen.entity;

public enum Role {
    ROLE_STUDENT,
    ROLE_KITCHEN_STAFF,
    ROLE_ADMIN;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return ROLE_STUDENT;
        String clean = roleStr.toUpperCase().trim();
        if (!clean.startsWith("ROLE_")) {
            clean = "ROLE_" + clean;
        }
        return Role.valueOf(clean);
    }
}
