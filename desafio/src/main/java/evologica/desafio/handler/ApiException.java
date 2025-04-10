package evologica.desafio.handler;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiException {
    private HttpStatus status;
    private String error;

    public ApiException(HttpStatus status, String errors) {
        super();
        this.status = status;
        this.error = errors;
    }

}
