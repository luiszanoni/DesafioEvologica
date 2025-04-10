export interface Pessoa {
  id?: number | null;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string | null;
  dataNascimento: string | null;
}
