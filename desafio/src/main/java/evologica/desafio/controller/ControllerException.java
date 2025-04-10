package evologica.desafio.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import evologica.desafio.entity.ApiException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class ControllerException extends ResponseEntityExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(EntityNotFoundException e) {
        log.error("Erro ao realizar requisicao: ", e);
        ApiException apiException = new ApiException(HttpStatus.NOT_FOUND, e.getMessage());
        return ResponseEntity.status(apiException.getStatus()).body(apiException.getError());
    }

    @ExceptionHandler({ ValidationException.class, EntityExistsException.class, NullPointerException.class
    })
    public ResponseEntity<Object> handleSaveException(Exception e) {
        log.error("Erro ao realizar requisicao: ", e);
        ApiException apiException = new ApiException(HttpStatus.BAD_REQUEST, e.getMessage());
        log.info(apiException.getError());
        return ResponseEntity.status(apiException.getStatus()).body(apiException.getError());
    }

    @ExceptionHandler({ ConstraintViolationException.class })
    public ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException e) {
        log.error("Erro de validação:", e);

        List<String> mensagens = e.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.toList());

        ApiException apiException = new ApiException(HttpStatus.BAD_REQUEST, mensagens.get(0));

        return ResponseEntity
                .status(apiException.getStatus())
                .body(apiException.getError());
    }
}
