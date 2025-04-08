package evologica.desafio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import evologica.desafio.dto.PessoaDTO;
import evologica.desafio.entity.Pessoa;
import evologica.desafio.service.PessoaService;

@Controller
@RequestMapping("/pessoa")
public class PessoaController {

    @Autowired
    PessoaService service;

    private Pageable pageable = Pageable.unpaged();

    @GetMapping("/{id}")
    ResponseEntity<PessoaDTO> getPessoa(@PathVariable Long id) {
        Pessoa response = service.getPessoaById(id);
        return ResponseEntity.ok(new PessoaDTO(response));
    }

    @GetMapping()
    ResponseEntity<Page<Pessoa>> getPagePessoa() {
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
        return ResponseEntity.status(201).body(new PessoaDTO(response));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deletePessoa(@PathVariable Long id) {
        service.deletePessoa(id);
        return ResponseEntity.status(200).body(null);
    }
}
