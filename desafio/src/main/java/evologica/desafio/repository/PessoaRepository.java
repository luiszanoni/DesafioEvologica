package evologica.desafio.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import evologica.desafio.entity.Pessoa;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    @Query("SELECT p FROM Pessoa p where p.cpf = :cpf")
    Pessoa validaCpf(@Param(value = "cpf") String cpf);

    @Query("SELECT p FROM Pessoa p WHERE " +
            "(:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
            "(:cpf IS NULL OR p.cpf = :cpf) AND " +
            "(:email IS NULL OR LOWER(p.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(:dataNascimentoInicio IS NULL OR p.dataNascimento >= :dataNascimentoInicio) AND " +
            "(:dataNascimentoFim IS NULL OR p.dataNascimento <= :dataNascimentoFim)")
    Page<Pessoa> buscarPessoas(@Param("nome") String nome,
            @Param("cpf") String cpf,
            @Param("dataNascimentoInicio") LocalDate dataNascimentoInicio,
            @Param("dataNascimentoFim") LocalDate dataNascimentoFim,
            @Param("email") String email,
            Pageable pageable);
}
