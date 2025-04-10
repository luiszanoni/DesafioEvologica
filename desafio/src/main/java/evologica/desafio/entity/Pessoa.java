package evologica.desafio.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
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

    @NotNull(message = "O nome e obrigatorio")
    @Column(name = "nome")
    private String nome;

    @NotNull(message = "O CPF e obrigatorio")
    @Column(name = "cpf")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter exatamente 11 dígitos numéricos")
    private String cpf;

    @Column(name = "email")
    @Email(message = "Digite um valor de email valido!")
    private String email;

    @Column(name = "telefone")
    @Pattern(regexp = "\\d+", message = "O telefone deve contar apenas dígitos numéricos")
    private String telefone;

    @NotNull(message = "A data de nascimento e obrigatoria")
    @Column(name = "nascimento")
    private LocalDate dataNascimento;
}
