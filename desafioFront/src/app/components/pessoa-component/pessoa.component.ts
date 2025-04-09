import { Component, OnInit } from '@angular/core';
import { Pessoa } from '../../model/pessoa-model';
import { PessoaService } from '../../services/pessoa-service.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-pessoa-component',
  imports: [NgFor, CommonModule],
  templateUrl: './pessoa-component.component.html',
  styleUrl: './pessoa-component.component.css',
})
export class PessoaComponent implements OnInit {
  pessoas!: any;

  constructor(private pessoaService: PessoaService) {}

  ngOnInit(): void {
    this.pessoaService.getAll().subscribe((data) => {
      this.pessoas = data;
    });
  }
}
