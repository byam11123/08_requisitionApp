package com.requisition.config;

import com.requisition.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        // Authentication failures should return 401
        if (message.contains("not found") || message.contains("Invalid credentials")
                || message.contains("deactivated")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (message.contains("User already exists")) {
            status = HttpStatus.CONFLICT;
        }

        return new ResponseEntity<>(
                new ApiResponse<>(false, message, null, LocalDateTime.now()),
                status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        // Handle database constraint violations (duplicate key, etc.)
        if (ex.getCause() instanceof org.hibernate.exception.ConstraintViolationException) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Duplicate entry - this record already exists", null, LocalDateTime.now()),
                    HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(
                new ApiResponse<>(false, "An unexpected error occurred: " + ex.getMessage(), null, LocalDateTime.now()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
