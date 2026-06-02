O BreathCare Health System consiste numa aplicação web destinada à prevenção e acompanhamento de doenças respiratórias crónicas, permitindo avaliar o controlo da doença através do questionário CARAT, monitorizar a evolução clínica do utente e gerar alertas para os profissionais de saúde, de forma automatizada, baseada em dados clínicos e acessível através de dashboards interativos.
O objetivo principal do sistema é apoiar a gestão contínua de doenças respiratórias crónicas, contribuindo para a prevenção de complicações, deteção precoce de agravamentos e melhoria do acompanhamento médico.
A implementação do sistema BreathCare assenta numa proposta de valor multidimensional que visa transformar o acompanhamento das doenças respiratórias através da tecnologia.

Requisitos funcionais
Os requisitos funcionais descrevem as funções, comportamentos e serviços que o sistema deve fornecer para satisfazer as necessidades dos seus utilizadores. Estes requisitos definem "o que" o sistema faz em resposta a determinadas entradas, detalhando as interações entre os perfis de utilizador (Utente, Médico e Administrador) e a plataforma.
A definição clara desses requisitos serve dois propósitos fundamentais neste projeto. Em primeiro lugar, servem como base para o desenho da arquitetura, do modelo de domínio e do diagrama de classes. Além disso, também permitem verificar e validar se o sistema cumpre os objetivos de prevenção e acompanhamento de doenças respiratórias, como a correta execução do módulo CARAT e a criação de alertas clínicos.
Ao documentar estes requisitos através de use cases, garantimos que todas as funcionalidades críticas — desde o cálculo do score de controlo da asma e rinite alérgica até à gestão de alertas médicos — estão devidamente alinhadas com as expectativas da clínica contratante.

Autenticação e Gestão de Perfis:
[FEITO] O sistema deve permitir que os utilizadores efetuem login através de credenciais de acesso;
[FEITO] O sistema deve identificar o perfil do utilizador autenticado (Utente, Médico ou Administrador);
[FEITO] O sistema deve restringir o acesso às funcionalidades de acordo com o perfil do utilizador;
[FEITO] O sistema deve permitir que os utilizadores terminem a sessão (logout).

Módulo CARAT:
[FEITO] O sistema deve permitir que o utente preencha e submeta o questionário CARAT;
[FEITO] O sistema deve validar as respostas submetidas pelo utente;
[FEITO] O sistema deve calcular automaticamente o score CARAT (e sub-scores, se aplicável) com base nas respostas fornecidas;
[FEITO] O sistema deve interpretar o resultado do score e determinar o nível de controlo da doença (ex: controlado/parcialmente/não controlado);
[FEITO] O sistema deve armazenar cada avaliação CARAT associada ao utente e à data de realização;
[FEITO] O sistema deve gerar recomendações automáticas com base no resultado da avaliação (ex. educação para autocuidado, sinais de alarme, revisão terapêutica);
[FEITO] O sistema deve sugerir a data para a próxima avaliação;
[FEITO] O sistema deve apresentar ao utente o resultado da avaliação, incluindo score, interpretação e recomendações.


Sistema de Alertas
[FEITO] O sistema deve gerar automaticamente alertas clínicos quando são detetadas situações de risco, nomeadamente:
[FEITO] o score CARAT está abaixo do limiar definido;
[FEITO] existe deterioração do score em relação à avaliação anterior;
[FEITO] existem sintomas persistentes;
[FEITO] existe indicação de necessidade de exames.
[FEITO] O sistema deve associar cada alerta a um utente e ao respetivo médico;
[FEITO] O sistema deve permitir que o médico consulte os alertas associados aos seus utentes;
[FEITO] O sistema deve permitir que o médico altere o estado de um alerta (Novo → Visto → Em Seguimento → Fechado);
[FEITO] O sistema deve permitir que o médico defina ou atualize a prioridade do alerta.

Dashboard do Utente
[FEITO] O sistema deve disponibilizar ao utente um dashboard de acompanhamento da doença;
[FEITO] O sistema deve apresentar um gráfico com a evolução temporal dos scores CARAT;
[FEITO] O sistema deve apresentar o histórico de avaliações realizadas;
[FEITO] O sistema deve mostrar uma linha de limiar (controlo insuficiente) para comparação;
[FEITO] O sistema deve mostrar, para cada avaliação:
[FEITO] data;
[FEITO] score obtido;
[FEITO] interpretação do resultado;
[FEITO] O sistema deve apresentar alertas associados ao estado clínico do utente;
[FEITO] O sistema deve apresentar recomendações associadas às avaliações realizadas.

Consulta Clínica pelo Médico
[FEITO] O sistema deve permitir que o médico consulte a lista de utentes sob sua responsabilidade;
[FEITO] O sistema deve permitir que o médico aceda ao perfil clínico de um utente;
[FEITO] O sistema deve permitir que o médico consulte o histórico de avaliações CARAT de um utente;
[FEITO] O sistema deve permitir que o médico consulte os alertas associados aos seus utentes;
[FEITO] O sistema deve permitir que o médico consulte dados clínicos (sintomas, medicação e exames clínicos) associados ao utente.

Gestão de Dados Clínicos
[FEITO] O sistema deve permitir que o médico registe dados clínicos (sintomas, medicação e exames clínicos) associados a um utente;
[FEITO] O sistema deve permitir que o médico atualize dados clínicos associados a um utente;
[FEITO] O sistema deve permitir ao utente atualizar os seus próprios dados pessoais.

Gestão de Utilizadores
[FEITO] O sistema deve permitir ao administrador atribuir ou alterar o perfil de um utilizador (Utente, Médico ou Administrador);
[FEITO] O sistema deve permitir ao administrador criar registos de utentes e médicos;
[FEITO] O sistema deve permitir ao administrador consultar registos de utentes e médicos;
[FEITO] O sistema deve permitir ao administrador atualizar informação de utentes e médicos;
[FEITO] O sistema deve permitir ao administrador eliminar registos de utentes e médicos;
[FEITO] O sistema deve permitir associar utentes a médicos responsáveis.

Gestão de dados simulados
[ ] O sistema deve permitir ao administrador inserir dados clínicos simulados no sistema para fins de teste e demonstração;
[ ] O sistema deve permitir ao administrador consultar e remover dados simulados.

Configuração do Sistema
[FEITO] O sistema deve permitir ao administrador definir o limiar mínimo do score CARAT utilizado para geração de alertas;
[FEITO] O sistema deve permitir ao administrador configurar parâmetros utilizados nas regras de alerta.

Endpoints REST mínimos:
[FEITO] - utentes (GET/patients, POST/patients, GET/patients/:id, PUT/PATCH/patients/:id, DELETE/patients/ :id)
[FEITO] - medicos (GET/medicos, POST/medicos, GET/medicos/:id, PUT/PATCH/medicos/:id, DELETE/medicos/ :id)
[FEITO] - Carat (POST/patients/id:/carat, GET/patients/:id/carat, GET/carat/:evalid)
[FEITO] - PATCH/alerts/:id (estado/prioridade)
[FEITO] Autenticação
[ ] FHIR???
[ ] Fazer testes de integração
[FEITO] Logs mínimos: registo de ações realizadas no sistema, por exemplo, na tabela do ficheiro database
