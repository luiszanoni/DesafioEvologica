package evologica.desafio.service;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import evologica.desafio.dto.PessoaDTO;
import evologica.desafio.entity.Pessoa;
import evologica.desafio.repository.PessoaRepository;
import jakarta.persistence.EntityExistsException;

@Service
public class PessoaService {

    @Autowired
    private PessoaRepository repository;

    public Pessoa getPessoaById(Long id) {
        Pessoa pessoa = repository.getReferenceById(id);
        return pessoa;
    }

    public Page<Pessoa> getAllPessoas(Pageable page) {
        Page<Pessoa> pessoa = repository.findAll(page);
        return pessoa;
    }

    public Page<Pessoa> buscarPessoas(String nome, String cpf, LocalDate dataNascimentoInicio,
            LocalDate dataNascimentoFim,
            String email,
            Pageable pageable) {

        return repository.buscarPessoas(nome, cpf, dataNascimentoInicio, dataNascimentoFim, email, pageable);
    }

    public Pessoa createPessoa(PessoaDTO dto) {
        Pessoa validador = repository.validaCpf(dto.getCpf());
        if (validador != null) {
            throw new EntityExistsException("Ja existe um usuario com esse cpf cadastrado!");
        }
        Pessoa pessoaCriada = montaPessoa(dto);
        repository.save(pessoaCriada);
        return pessoaCriada;
    }

    public Pessoa editPessoa(PessoaDTO dto, Long id) {
        Pessoa pessoaRegistrada = getPessoaById(id);
        Pessoa validador = repository.validaCpf(dto.getCpf());
        if (validador != null && !(pessoaRegistrada.getCpf().equalsIgnoreCase(dto.getCpf()))) {
            throw new EntityExistsException(
                    "Nao se deve mudar o cpf para um ja registrado no banco de dados!");
        }
        pessoaRegistrada.setNome(dto.getNome());
        pessoaRegistrada.setCpf(dto.getCpf());
        pessoaRegistrada.setEmail(dto.getEmail());
        pessoaRegistrada.setTelefone(dto.getTelefone());
        pessoaRegistrada.setDataNascimento(dto.getDataNascimento());
        repository.save(pessoaRegistrada);
        return pessoaRegistrada;
    }

    public void deletePessoa(Long id) {
        Pessoa pessoaRegistrada = getPessoaById(id);
        repository.delete(pessoaRegistrada);
    }

    public Pessoa montaPessoa(PessoaDTO dto) {
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(dto.getNome());
        pessoa.setCpf(dto.getCpf());
        pessoa.setEmail(dto.getEmail());
        pessoa.setTelefone(dto.getTelefone());
        pessoa.setDataNascimento(dto.getDataNascimento());
        return pessoa;
    }
}
