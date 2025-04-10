import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../model/pessoa-model';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'http://localhost:8080/pessoa';
  }

  public getAll(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl);
  }

  public getById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  public post(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  public put(pessoa: Pessoa, id: number): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/${id}`, pessoa);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<Pessoa>(`${this.apiUrl}/${id}`);
  }

  buscar(
    nome?: string,
    cpf?: string,
    email?: string,
    dataNascimentoInicio?: Date,
    dataNascimentoFim?: Date
  ): Observable<any> {
    const locale = 'pt-BR';
    let params = new HttpParams();
    if (nome) params = params.set('nome', nome);
    if (cpf) params = params.set('cpf', cpf);
    if (email) params = params.set('email', email);

    if (dataNascimentoInicio) {
      dataNascimentoInicio.setUTCHours(3);
      params = params.set(
        'dataNascimentoInicio',
        dataNascimentoInicio.toISOString()
      );
    }

    if (dataNascimentoFim) {
      dataNascimentoFim.setUTCHours(3);
      params = params.set('dataNascimentoFim', dataNascimentoFim.toISOString());
    }

    return this.http.get(`${this.apiUrl}/buscar`, { params });
  }
}
