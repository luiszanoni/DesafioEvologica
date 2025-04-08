package evologica.desafio.dto;

import java.time.LocalDate;

import evologica.desafio.entity.Pessoa;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PessoaDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;

    public PessoaDTO(Pessoa pessoa) {
        this.id = pessoa.getId();
        this.nome = pessoa.getNome();
        this.cpf = pessoa.getCpf();
        this.email = pessoa.getEmail();
        this.telefone = pessoa.getTelefone();
        this.dataNascimento = pessoa.getDataNascimento();
    }
}
