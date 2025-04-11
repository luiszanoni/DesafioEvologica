# Desafio Evologica

Este projeto Full-Stack contém uma API REST desenvolvida com Java 21 e Spring Boot 3.4.4, localizada no diretório /desafio, e uma Interface Web desenvolvida com Angular, TypeScript e Tailwind CSS no diretório /desafioFront. O objetivo do projeto é permitir o gerenciamento de dados de pessoas, com funcionalidades de criação, listagem, busca com filtros, atualização e exclusão.

## Tecnologias utilizadas na API

- Java 21
- Spring Boot 3.4.4
- Spring Web
- Spring Data JPA
- Postgres
- Lombok
- Maven
- Docker e Docker Compose

## Pré-requisitos para rodar a API

Antes de iniciar a API, é necessário ter instalado:

- [Docker Desktop](https://docs.docker.com/get-docker/)
- [Java 21](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html)
- [Maven](https://maven.apache.org/install.html)
- [Git](https://git-scm.com/)

## Tecnologias utilizadas na Interface Web

- Angular v19
- Tailwind.css v4.0
- Typescript
- Node.js

## Pré-requisitos para rodar a Interface Web

Antes de iniciar a interface, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão recomendada: 23)

# Como rodar o projeto

1. Clone o repositorio no GitHub, use o comando abaixo no terminal de sua preferência (CMD, PowerShell ou Git Bash):.

```Bash
    https://github.com/luiszanoni/DesafioEvologica.git
```

2. Acesse a pasta do projeto

```Bash
    cd DesafioEvologica
```

## Instalando dependências e rodando a API

1. Da pasta do nosso projeto, acesse o diretório da API e execute o comando de instalação do Maven:

```Bash
    cd desafio
    mvn clean install
```
2. Com a mensagem de sucesso apos a instalação, podemos escrever o comando para inicar a API. 

**IMPORTANTE: O Docker precisa estar em execução para os próximos passos.**.

```Bash
    mvn spring-boot:run
```

3. Verifique no Docker Desktop se o container chamado desafio está em execução junto com o container postgres-1.

4. Se tudo estiver certo, a API estará rodando e conectada ao banco de dados no Docker, com a tabela Pessoa já mapeada automaticamente.

5. A documentação da API estará disponível no [Swagger](http://localhost:8080/swagger-ui/index.html). É por esse endereço (porta 8080) que a API poderá ser acessada para envio e recebimento de dados.

## Instalando dependências e rodando a Interface Web (Angular)

1. Agora, **em um outro terminal** originando da pasta do nosso projeto vamos acessar o diretório da Interface Web, e nele vamos instalar todas as dependências definidas no pacote package-json.

```Bash
    cd desafioFront
    npm install
```

2. Com as dependências instaladas, inicie a interface Angular:

```Base
    ng serve
```

3. Após iniciado teremos acesso a nossa Interface Web na porta http://localhost:4200/ que pode ser acessado pelo navegador comum de sua escolha.




**Pronto! Com todos esses passos, agora é possível interagir com a interface em tempo real e utilizar todas as funcionalidades integradas à API**




# Explicação das decisões tomadas durante o processo de desenvolvimento

## Início do projeto

Para começar o projeto, resolvi iniciar desenvolvendo o CRUD da entidade Pessoa, já que é a rotina de desenvolvimento com a qual tenho mais familiaridade.

Separei o projeto em pastas para melhor organizar o código, utilizando as seguintes estruturas: controller, entity, service, dto, repository e config.

Na pasta entity, armazenei a entidade Pessoa. Usei os recursos do Jakarta para otimizar o processo de criação da tabela e suas restrições. As anotações @Entity, @Table, @Id, @Column e @GeneratedValue fazem, de forma automática, a criação da tabela no banco de dados quando executamos o código pela primeira vez. Também defini, com as anotações, conforme listado nas especificações do projeto, os campos obrigatórios e opcionais, utilizando a anotação @NotNull.

No service, desenvolvi a lógica central de todo o CRUD de Pessoas. Como o nome já diz, um CRUD é um grupo de métodos relacionados às funções de criação, leitura, edição e exclusão de registros da entidade no banco de dados.

Nesta classe, declaramos o repository, que é o responsável por realizar as requisições relacionadas à tabela da entidade diretamente no banco.

```Bash
    @Autowired
    private PessoaRepository repository;
```

Com o repositório declarado no service, conseguimos implementar a lógica de processamento dos objetos e realizar operações como registro, consulta ou exclusão no banco de dados.

Uma ênfase muito grande foi dada à validação do campo CPF. Em teoria, trata-se de um campo simples — apenas 11 dígitos numéricos que devem ser únicos no banco de dados. No entanto, a Receita Federal define um algoritmo específico que determina quais sequências de números podem ser consideradas um CPF válido.

Tendo isso em mente, desenvolvi o método calculaDigitoMod11(), que reproduz esse algoritmo oficial e indica ao usuário, mesmo que ele digite 11 números aleatórios, se o CPF informado é válido ou não.

No controller, utilizei a estrutura padrão, mapeando o endpoint com a anotação @RequestMapping(), onde definimos o caminho base para que os usuários da API possam executar os métodos. No caso do controller de pessoas, com o caminho definido como "/pessoa", o usuário deve acessar o endereço http://localhost:8080/pessoa sempre que quiser realizar uma requisição relacionada à entidade Pessoa. Nos próprios métodos, usamos anotações específicas para definir o tipo de requisição (@GetMapping, @PostMapping, etc.) e, quando necessário, um caminho adicional.

```Bash
    @GetMapping("/{id}")
    ResponseEntity<PessoaDTO> getPessoa(@PathVariable Long id) {
        Pessoa response = service.getPessoaById(id);
        return ResponseEntity.ok(new PessoaDTO(response));
    }
```
Neste exemplo, o @GetMapping define que se trata de uma requisição do tipo GET, e o valor dentro dos parênteses indica o caminho adicional da rota. Ou seja, para acessar essa rota, o usuário precisaria fazer uma requisição para http://localhost:8080/pessoa/{id}, onde {id} representa o identificador da pessoa, que é definido no próprio método como um número do tipo Long.

Um dos maiores desafios no desenvolvimento da API foi justamente a implementação do filtro de busca com múltiplos parâmetros independentes entre si. Isso exigiu uma lógica mais cuidadosa para garantir que os campos pudessem ser utilizados de forma isolada ou combinada, sem interferir uns nos outros, e mantendo a flexibilidade nas consultas ao banco de dados.

```Bash
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
```

Esse método foi particularmente desafiador, pois, ao tentar montar a requisição ao banco de dados, o JDBC (que é a linguagem de interface usada pelos repositórios JPA no Java) não conseguia passar os valores corretamente. Campos como datas com possibilidade de serem null — e até mesmo textos — faziam com que o JDBC não conseguisse identificar corretamente o tipo de dado, resultando em falhas na execução da query.

A solução encontrada foi utilizar uma native query com uma cláusula SQL do tipo TRUE, garantindo que os valores enviados, mesmo quando null, fossem tratados de forma explícita. Dessa forma, o SQL interpretava corretamente os parâmetros, permitindo a execução bem-sucedida da consulta.

```Bash
            @Query(nativeQuery = true, value = "SELECT * FROM Pessoa p WHERE " +
                        "(:nome IS NULL OR LOWER(p.nome) LIKE CONCAT('%', LOWER(:nome), '%')) AND " +
                        "(:cpf IS NULL OR p.cpf = :cpf) AND " +
                        "(:email IS NULL OR LOWER(p.email) LIKE CONCAT('%', LOWER(:email), '%')) AND " +
                        "(TRUE = :#{#dataNascimentoInicio == null} OR p.nascimento >= :dataNascimentoInicio) AND " +
                        "(TRUE = :#{#dataNascimentoFim == null} OR p.nascimento <= :dataNascimentoFim)")
        Page<Pessoa> buscarPessoas(@Param("nome") String nome,
                        @Param("cpf") String cpf,
                        @Param("dataNascimentoInicio") LocalDate dataNascimentoInicio,
                        @Param("dataNascimentoFim") LocalDate dataNascimentoFim,
                        @Param("email") String email,
                        Pageable pageable);
```

## Tratamento de erros da API

Para o tratamento de erros da API, optei pela construção de um @ControllerAdvice. Com o uso dessa anotação e de uma classe personalizada chamada ApiException, foi possível filtrar todas aquelas informações extensas e técnicas normalmente presentes nas mensagens de erro, retornando ao usuário mensagens mais claras e personalizadas, de acordo com o tipo de erro encontrado.

Essa etapa foi fundamental para o desenvolvimento do projeto, exigindo atenção a todos os possíveis erros que poderiam ocorrer durante o uso da API, seja pela interface web ou por requisições diretas ao back-end.

Ao final, mais de sete classes de exceções diferentes foram tratadas, o que tornou a navegação pelo sistema mais fluida e forneceu um feedback mais compreensível sobre os problemas ocorridos.

## Desenvolvendo a Interface

Para o desenvolvimento da interface em Angular, comecei utilizando o comando ng generate para gerar as classes necessárias. Sempre antes de começar, procuro analisar, com base no back-end, quais classes serão necessárias, para me organizar antes de escrever o código.

- No caso da nossa interface em Angular, como estávamos trabalhando com um único objeto, foi necessário criar:
- Um model (Pessoa), replicando a estrutura da entidade Pessoa presente no back-end;
- Um service, responsável por definir a rota de conexão com os endpoints da API e determinar os tipos de dados manipulados;
- Um component, contendo o HTML e CSS da página relacionada à entidade Pessoa, além do arquivo TypeScript com as funções e lógicas da interface.

Utilizei os seguintes comandos no terminal:

```Bash
    ng generate service pessoa-service
    ng generate component pessoa-component
```

Como o model seria apenas uma classe simples, criei rapidamente uma pasta específica contendo o arquivo do model.

O primeiro passo no desenvolvimento da interface foi definir a rota principal da aplicação, para que, ao acessar http://localhost:4200/, o usuário fosse redirecionado diretamente para a página de listagem de pessoas. Para isso, configurei a rota no arquivo app.routes.ts da seguinte forma:

```Bash
  {
    path: 'pessoas',
    component: PessoaComponent,
  },
  { path: '', redirectTo: '/pessoas', pathMatch: 'full' },
```

Neste projeto, escolhi utilizar componentes do PrimeNG integrados com Tailwind CSS. O Tailwind é uma ferramenta que permite aplicar estilos diretamente no HTML, unificando a estrutura com o CSS. Isso facilita a estilização de campos, textos e elementos sem a necessidade de alternar entre arquivos HTML e CSS.

Exemplo de uso:

```Bash
<div class="items-start bg-teal-400">
    <img class="h-28 ml-4" src="https://avatars.githubusercontent.com/u/11943857?s=280&v=4" alt="Evologo">
</div>
```

Esse estilo de escrita resulta em um código mais direto e intuitivo, eliminando a necessidade de identificar elementos separadamente no CSS para aplicar estilos.

## Experiência do Usuário e Tratamento de Erros

Para melhorar a experiência do usuário e minimizar erros, optei por utilizar componentes do PrimeNG, como o inputMask, que de certa forma guia o usuário a digitar conforme o que o sistema exige. Por exemplo, no campo de CPF, o inputMask já impede a digitação de letras e, à medida que o usuário digita, a pontuação é adicionada automaticamente, evitando que ele se perca nas informações.

Uma escolha semelhante foi o uso do componente date-picker. Nele, ao selecionar o campo de data, um calendário é aberto, permitindo que o usuário escolha a data de forma rápida e prática.

A ideia para o desenvolvimento dessa interface foi criar um sistema familiar, simples e extremamente informativo. Além do tratamento de erros com mensagens e avisos visíveis na tela, um dos principais focos foi garantir que as informações fossem fáceis de identificar e familiares ao usuário. Os campos de data foram adaptados para o padrão brasileiro (dd-MM-yyyy), o CPF é exibido com a formatação adequada e o número de telefone inclui o código do país e o DDD.

## Final do desenvolvimento

No final do desenvolvimento, meu foco foi entregar os diferenciais propostos. Na parte de front-end, o deploy da aplicação foi feito na [Vercel](https://desafio-evologica-6vl5mhp4o-lgzanonis-projects.vercel.app/pessoas). Para proporcionar uma experiência ainda mais completa, procurei um ambiente para hospedar minha API. Tentei utilizar Supabase, Railway e outras alternativas gratuitas, mas não foi possível realizar a hospedagem da API a tempo de integrá-la com o deploy na Vercel.

Além do que foi desenvolvido até a data de hoje, ainda há melhorias que gostaria de implementar neste sistema, como:

- Validar o CPF de acordo com o banco de dados da Receita Federal, por meio da API do proprio governo, enquanto o usuário digita na interface.
- Criar um listener para auxiliar na digitação de datas no campo de escolha de data.
- Validar e-mails atípicos, como por exemplo: email@com.gmail.
- Ajustar a interface para um design responsivo.
- Exibir uma mensagem clara ao realizar buscas sem filtros, indicando que todos os registros do banco de dados foram retornados.
- Implementar um campo booleano "ativo" no banco de dados, com o objetivo de registrar usuários que já passaram pelo sistema, mas que estão desligados.
- Alterar o calendário para o idioma português brasileiro, adaptando os nomes dos meses e dias.
- Implementar testes unitários.








