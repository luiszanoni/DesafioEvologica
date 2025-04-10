package evologica.desafio.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import evologica.desafio.dto.PessoaDTO;
import evologica.desafio.entity.Pessoa;
import evologica.desafio.service.PessoaService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/pessoa")
public class PessoaController {

    @Autowired
    PessoaService service;

    @GetMapping("/{id}")
    ResponseEntity<PessoaDTO> getPessoa(@PathVariable Long id) {
        Pessoa response = service.getPessoaById(id);
        return ResponseEntity.ok(new PessoaDTO(response));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<Pessoa>> buscarPessoas(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataNascimentoInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataNascimentoFim,
            @RequestParam(required = false) String email,
            Pageable pageable) {

        log.info(nome);
        Page<Pessoa> pessoas = service.buscarPessoas(nome, cpf, dataNascimentoInicio, dataNascimentoFim, email,
                pageable);
        return ResponseEntity.ok(pessoas);
    }

    @GetMapping()
    ResponseEntity<Page<Pessoa>> getPagePessoa(Pageable pageable) {
        Page<Pessoa> response = service.getAllPessoas(pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    ResponseEntity<Pessoa> createPessoa(@RequestBody PessoaDTO pessoaDTO) {
        Pessoa response = service.createPessoa(pessoaDTO);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    ResponseEntity<PessoaDTO> editPessoa(@RequestBody PessoaDTO pessoaDTO, @PathVariable Long id) {
        Pessoa response = service.editPessoa(pessoaDTO, id);
        return ResponseEntity.status(200).body(new PessoaDTO(response));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deletePessoa(@PathVariable Long id) {
        service.deletePessoa(id);
        return ResponseEntity.status(200).body(null);
    }
}
