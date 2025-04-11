package evologica.desafio.service;

import java.time.LocalDate;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import evologica.desafio.dto.PessoaDTO;
import evologica.desafio.entity.Pessoa;
import evologica.desafio.repository.PessoaRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.ValidationException;

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
        if (!(cpf == null)) {
            if (!calculaDigitoMod11(cpf) || verificaNumerosIguais(cpf)) {
                throw new ValidationException(
                        "De acordo com as normas da Receita Federal, esse não é um número válido para CPF.");
            }
        }

        return repository.buscarPessoas(nome, cpf, dataNascimentoInicio, dataNascimentoFim, email, pageable);
    }

    public Pessoa createPessoa(PessoaDTO dto) {
        if (!calculaDigitoMod11(dto.getCpf()) || verificaNumerosIguais(dto.getCpf())) {
            throw new ValidationException(
                    "De acordo com as normas da Receita Federal, esse não é um número válido para CPF.");
        }
        Pessoa validador = repository.validaCpf(dto.getCpf());
        if (validador != null) {
            throw new EntityExistsException("Ja existe um usuario com esse CPF cadastrado.");
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
                    "Não se deve mudar o CPF para um já registrado no banco de dados.");
        }
        if (!calculaDigitoMod11(dto.getCpf()) || verificaNumerosIguais(dto.getCpf())) {
            throw new ValidationException(
                    "De acordo com as normas da Receita Federal, esse não é um número válido para CPF.");
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

    public boolean calculaDigitoMod11(String numero) {
        if (Pattern.matches("[a-zA-Z]+", numero)) {
            throw new ValidationException("O campo CPF deve conter somente dígitos numéricos.");
        }

        String dado = numero.substring(0, numero.length() - 2);
        String digitos = numero.substring(numero.length() - 2, numero.length());

        int numDig = 2;

        int mult;
        int soma;
        int i;
        int n;
        int dig;

        for (n = 1; n <= numDig; n++) {
            soma = 0;
            mult = 2;
            for (i = dado.length() - 1; i >= 0; i--) {
                soma += (mult * Integer.parseInt(dado.substring(i, i + 1)));
                if (++mult > 12)
                    mult = 2;
            }
            dig = ((soma * 10) % 11) % 10;
            if (dig == 10) {
                dado += "X";
            } else {
                dado += String.valueOf(dig);
            }
        }
        String digitoGerado = dado.substring(dado.length() - numDig, dado.length());
        return digitoGerado.equals(digitos);
    }

    public boolean verificaNumerosIguais(String cpf) {
        char primeiroDigito = cpf.charAt(0);
        for (int i = 1; i < cpf.length(); i++) {
            if (cpf.charAt(i) != primeiroDigito) {
                return false;
            }
        }
        return true;
    }
}
