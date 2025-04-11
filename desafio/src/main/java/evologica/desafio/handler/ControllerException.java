package evologica.desafio.handler;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Hidden
@RestControllerAdvice
public class ControllerException extends ResponseEntityExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(EntityNotFoundException e) {
        log.error("Erro ao realizar requisicao: ", e);
        ApiException apiException = new ApiException(HttpStatus.NOT_FOUND, e.getMessage());
        return ResponseEntity.status(apiException.getStatus()).body(apiException.getError());
    }

    @ExceptionHandler({ ValidationException.class, EntityExistsException.class, NullPointerException.class,
            NumberFormatException.class
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

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            org.springframework.http.HttpHeaders headers,
            HttpStatusCode status,
            org.springframework.web.context.request.WebRequest request) {

        if (ex.getCause() instanceof com.fasterxml.jackson.databind.exc.InvalidFormatException) {
            return ResponseEntity
                    .badRequest()
                    .body("Formato inválido para campo data. Use o formato yyyy-MM-dd.");
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Requisição malformada: " + ex.getMessage());
    }
}
