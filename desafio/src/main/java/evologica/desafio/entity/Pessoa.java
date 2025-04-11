package evologica.desafio.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O nome é obrigatório.")
    @Column(name = "nome")
    @Pattern(regexp = "\\D+", message = "O campo nome só deve ter caracteres alfabéticos.")
    private String nome;

    @NotNull(message = "O CPF é obrigatório.")
    @Column(name = "cpf")
    @Pattern(regexp = "\\d{11}", message = "O campo CPF deve conter exatamente 11 dígitos numéricos.")
    private String cpf;

    @Column(name = "email")
    @Pattern(regexp = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$", message = "Digite um endereço de E-mail válido.")
    private String email;

    @Column(name = "telefone")
    @Pattern(regexp = "\\d+", message = "O campo telefone deve contar apenas dígitos numéricos.")
    private String telefone;

    @NotNull(message = "O campo data de nascimento é obrigatório.")
    @Column(name = "nascimento")
    private LocalDate dataNascimento;
}
