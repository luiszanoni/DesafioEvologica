import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { Toast, ToastModule } from 'primeng/toast';
import { Toolbar, ToolbarModule } from 'primeng/toolbar';
import { PessoaService } from '../../services/pessoa-service.service';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { RadioButton } from 'primeng/radiobutton';
import { Tag } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { Ripple } from 'primeng/ripple';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Pessoa } from '../../model/pessoa-model';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { error } from 'console';

@Component({
    selector: 'app-pessoa-component',
    imports: [
        NgFor,
        CommonModule,
        ButtonModule,
        Toolbar,
        Toast,
        TableModule,
        Dialog,
        Ripple,
        SelectModule,
        ToastModule,
        ToolbarModule,
        ConfirmDialog,
        InputTextModule,
        TextareaModule,
        CommonModule,
        FileUpload,
        DropdownModule,
        Tag,
        RadioButton,
        Rating,
        InputTextModule,
        FormsModule,
        InputNumber,
        IconFieldModule,
        InputIconModule,
        CardModule,
        InputMaskModule,
        DatePickerModule,
    ],
    providers: [MessageService, PessoaService, ConfirmationService],
    templateUrl: './pessoa-component.component.html',
    styleUrl: './pessoa-component.component.css',
})
export class PessoaComponent implements OnInit {
    pessoas!: any;

    rangeDates = [];

    filtro = {
        nome: '',
        cpf: '',
        email: '',
        dataNascimentoInicio: undefined,
        dataNascimentoFim: undefined,
    };

    pessoa: Pessoa = {
        nome: '',
        cpf: '',
        dataNascimento: null,
    };

    submitted: boolean = false;

    saveForm: boolean = false;

    pessoaCard: boolean = false;

    cols = [
        { field: 'nome', header: 'Nome' },
        { field: 'cpf', header: 'CPF' },
        { field: 'email', header: 'Email' },
    ];

    constructor(
        private pessoaService: PessoaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.pessoaService.getAll().subscribe((data) => {
            this.pessoas = data;
        });
    }

    reloadData(): void {
        this.pessoaService.getAll().subscribe((data) => {
            this.pessoas = data;
        });
    }

    buscarPessoas(): void {
        console.log(this.filtro);
        const { nome, cpf, email, dataNascimentoInicio, dataNascimentoFim } =
            this.filtro;

        this.pessoaService
            .buscar(nome, cpf, email, dataNascimentoInicio, dataNascimentoFim)
            .subscribe({
                next: (res) => {
                    this.pessoas = res;
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Busca realizada com sucesso!'
                    })
                },
                error: (err) => {
                    console.error('Erro ao buscar pessoas', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: err
                    })
                },
            });
    }

    openNew() {
        this.pessoa = this.pessoa = {
            id: null,
            nome: '',
            cpf: '',
            dataNascimento: null,
        };
        this.submitted = false;
        this.saveForm = true;
    }

    editPessoa(p: Pessoa) {
        console.log('Pessoa recebida para edição:', p);
        console.log(
            'Tipo de dataNascimento:',
            typeof p.dataNascimento,
            p.dataNascimento
        );

        this.pessoa = {
            ...p,
        };
        this.saveForm = true;
    }

    savePessoa() {
        this.submitted = true;
        if (this.formValido()) {
            if (this.pessoa.id) {
                if (!this.pessoa.telefone || this.pessoa.telefone.trim() === '') {
                    this.pessoa.telefone = null;
                }
                this.pessoaService.put(this.pessoa, this.pessoa.id).subscribe({
                    next: (res) => {
                        this.messageService.add({
                            severity: "info",
                            summary: 'Pessoa editada com sucesso',
                            detail: 'Pessoa: ' + res.nome + ' de CPF: ' + res.cpf
                        })
                        this.reloadData();
                        this.saveForm = false;
                    },
                    error: (err) => {

                        this.messageService.add({
                            severity: "error",
                            summary: "Erro ao editar Pessoa",
                            detail: err.error
                        })
                    }
                });
            } else {
                console.log(this.pessoa);
                if (!this.pessoa.telefone || this.pessoa.telefone.trim() === '') {
                    this.pessoa.telefone = null;
                }
                this.pessoaService.post(this.pessoa).subscribe({
                    next: (res) => {
                        this.messageService.add({
                            severity: "info",
                            summary: 'Pessoa cadastrada com sucesso',
                            detail: res.nome + 'de CPF: ' + res.cpf
                        })
                        this.reloadData();
                        this.saveForm = false;
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Erro ao cadastrar Pessoa",
                            detail: err.error
                        })
                    }
                });
            }
        }
    }

    deletePessoa(id: number) {
        this.confirmationService.confirm({
            message:
                'Você tem certeza que deseja excluir esse registro? Essa ação é final e nao pode ser revertida.',
            header: 'Excluir Registro',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Excluir',
            },
            accept: () => {
                this.pessoaService.delete(id).subscribe({
                    next: (res) => {
                        this.messageService.add({
                            severity: "info",
                            summary: 'Pessoa deletada com sucesso',
                        })
                        this.reloadData();
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Erro ao deletar Pessoa",
                            detail: err?.error?.message
                        })
                    }
                });
            },
        });
    }

    mostrarCardPessoa(pessoa: Pessoa) {
        console.log(pessoa);
        this.pessoa = pessoa;
        this.pessoaCard = true;
    }

    formValido(): boolean {
        return (
            !!this.pessoa.nome && !!this.pessoa.cpf && !!this.pessoa.dataNascimento
        );
    }

    hideDialog() {
        this.saveForm = false;
        this.submitted = false;
        this.pessoa = { id: null, nome: '', cpf: '', dataNascimento: null };
    }
}
