import express from 'express';
import path from 'path';
import { AppDataSource } from './database/database';
import bcrypt from 'bcryptjs';
import { Log } from './models/log.entity';
import authRoutes from './routes/auth.routes';

// Importação das Entidades
import { Utilizador } from './models/utilizador.entity';
import { Utente } from './models/utente.entity';
import { Medico } from './models/medico.entity';
import { Prescricao } from './models/prescricao.entity';
import { Exame } from './models/exame.entity';
import { AvaliacaoCarat } from './models/avaliacao-carat.entity';
import { Alerta } from './models/alerta.entity';
import { AlertaEstado } from './enums/AlertaEstado.enum';
import { AlertaPrioridade } from './enums/AlertaPrioridade.enum';
import { TipoAlerta } from './enums/TipoAlerta.enum';
import { Configuracao } from './models/configuracao.entity';
import { NivelControlo } from './enums/NivelControlo.enum';
import { SexoBiologico } from './enums/SexoBiologico.enum';
import { EspecialidadeMedica } from './enums/EspecialidadeMedica.enum';
import { TipoUtilizador } from './enums/TipoUtilizador.enum';
import { TipoExame } from './enums/TipoExame.enum';
import { ViaAdministracao } from './enums/ViaAdministracao.enum';

// Importação das Rotas
import utenteRoutes from './routes/utente.routes';
import medicoRoutes from './routes/medico.routes';
import examenRoutes from './routes/exame.routes';
import prescricaoRoutes from './routes/prescricao.routes';
import caratRoutes from './routes/carat.routes';
import alertaRoutes from './routes/alerta.routes';
import configuracaoRoutes from './routes/configuracao.routes';
import recomendacaoRoutes from './routes/recomendacao.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// ATIVAÇÃO DAS ROTAS DE AUTENTICAÇÃO (Mapeado com o Frontend)
app.use('/auth', authRoutes);

app.use('/utente', utenteRoutes);
app.use('/medico', medicoRoutes);
app.use('/exames', examenRoutes);
app.use('/prescricoes', prescricaoRoutes);
app.use('/utente', caratRoutes);  // POST /utente/:id/carat  |  GET /utente/:id/carat
app.use('/carat', caratRoutes);   // GET /carat/:evalId
app.use('/alertas', alertaRoutes);
app.use('/configuracao', configuracaoRoutes);
app.use('/admin', adminRoutes);
app.use('/recomendacoes', recomendacaoRoutes);


// Inicialização da base de dados e servidor
if (require.main === module) {
    AppDataSource.initialize().then(async () => { 
        console.log("Base de Dados SQLite conectada com sucesso!");

        // Utilizadores Simulados (Autenticação baseada em Username)
        const userRepo = AppDataSource.getRepository(Utilizador);
        if (await userRepo.count() === 0) {
            const passwordHash = await bcrypt.hash('123456', 10);

            await userRepo.save([
                {
                    nome: 'Administrador',
                    username: 'admin',
                    password: passwordHash,
                    role: TipoUtilizador.ADMIN
                },
                {
                    nome: 'Jorge Almeida',
                    username: 'jorge.almeida',
                    password: passwordHash,
                    role: TipoUtilizador.MEDICO
                },
                {
                    nome: 'Maria Laurentina',
                    username: 'maria.laurentina',
                    password: passwordHash,
                    role: TipoUtilizador.UTENTE
                },
                {
                    nome: 'António Silva',
                    username: 'antonio.silva',
                    password: passwordHash,
                    role: TipoUtilizador.UTENTE
                }
            ]);
            console.log('Utilizadores simulados criados (password de todos: 123456)');
        }

        // Médicos Simulados
        const medicoRepo = AppDataSource.getRepository(Medico);
        if (await medicoRepo.count() === 0) {
            await medicoRepo.save({
                nome: 'Jorge Almeida',
                especialidade: EspecialidadeMedica.PNEUMOLOGIA,
                cedulaProfissional: 12345,
                dataNascimento: new Date("1970-05-15"),
                sexo: SexoBiologico.MASCULINO,
                contacto: "960000000",
                utilizadorId: 2
            });
        }
        
        // Utentes Simulados
        const utenteRepo = AppDataSource.getRepository(Utente);
        if (await utenteRepo.count() === 0) {
            await utenteRepo.save([
                {
                    nome: "Maria Laurentina",
                    numeroUtente: 123456789,
                    dataNascimento: new Date("1965-04-12"),
                    sexo: SexoBiologico.FEMININO,
                    contacto: "912345678",
                    medicoId: 1,
                    utilizadorId: 3
                },
                {
                    nome: "António Silva",
                    numeroUtente: 987654321,
                    dataNascimento: new Date("1958-11-23"),
                    sexo: SexoBiologico.MASCULINO,
                    contacto: "934567890",
                    medicoId: 1,
                    utilizadorId: 4
                }
            ]);
        }

        // Prescrições Simuladas
        const prescricaoRepo = AppDataSource.getRepository(Prescricao);
        if (await prescricaoRepo.count() === 0) {
            const maria = await utenteRepo.findOneBy({ numeroUtente: 123456789 });
            if (maria) {
                const dataValidadeSimulada = new Date();
                dataValidadeSimulada.setDate(dataValidadeSimulada.getDate() + 180);

                await prescricaoRepo.save({
                    medicamento: 'Aspirina',
                    dose: '500mg',
                    viaAdministracao: ViaAdministracao.ORAL,
                    medico_nome: 'Jorge Almeida',
                    utenteId: maria.id,
                    dataValidade: dataValidadeSimulada
                });
            }
        }

        // Exames Simulados
        const exameRepo = AppDataSource.getRepository(Exame);
        if (await exameRepo.count() === 0) {
            const antonio = await utenteRepo.findOneBy({ numeroUtente: 987654321 });
            if (antonio) {
                const dataValidadeSimulada = new Date();
                dataValidadeSimulada.setDate(dataValidadeSimulada.getDate() + 180);

                await exameRepo.save({
                    nome: 'RX Tórax',
                    tipo: TipoExame.RADIOGRAFIA_TORAX,
                    codigo: 'RX01',
                    medico_nome: 'Jorge Almeida',
                    utenteId: antonio.id,
                    dataValidade: dataValidadeSimulada
                });
            }
        }
        
        // Configuração do Sistema (valores por defeito)
        const configuracaoRepo = AppDataSource.getRepository(Configuracao);
        if (await configuracaoRepo.count() === 0) {
            await configuracaoRepo.save(new Configuracao());
            console.log("Configuração do sistema criada com valores por defeito.");
        }

        // Dados CARAT Simulados
        const caratRepo = AppDataSource.getRepository(AvaliacaoCarat);
        if (await caratRepo.count() === 0) {
            const maria = await utenteRepo.findOneBy({ numeroUtente: 123456789 });
            const antonio = await utenteRepo.findOneBy({ numeroUtente: 987654321 });

            if (maria && antonio) {
                const proxAvaliacao = new Date("2026-06-17"); // ~4 semanas após a última avaliação

                await caratRepo.save([
                    {
                        data: new Date("2026-04-10"),
                        p1: 1, p2: 1, p3: 1, p4: 1,
                        p5: 1, p6: 2, p7: 1, p8: 1, p9: 1, p10: 1,
                        scoreTotal: 11,
                        subScoreViasSuperiores: 4,
                        subScoreViasInferiores: 7,
                        nivelControlo: NivelControlo.NAO_CONTROLADO,
                        interpretacao: "Doença Respiratória Não Controlada (Controlo Insuficiente).",
                        recomendacoes: "Score CARAT abaixo do limiar mínimo. Revisão terapêutica urgente recomendada.",
                        proximaAvaliacao: new Date("2026-05-08"),
                        utenteId: maria.id
                    },
                    {
                        data: new Date("2026-05-20"),
                        p1: 3, p2: 3, p3: 2, p4: 3,
                        p5: 3, p6: 2, p7: 2, p8: 3, p9: 2, p10: 2,
                        scoreTotal: 25,
                        subScoreViasSuperiores: 11,
                        subScoreViasInferiores: 14,
                        nivelControlo: NivelControlo.CONTROLADO,
                        interpretacao: "Doença Respiratória Controlada.",
                        recomendacoes: "Excelente estado clínico! Continue com o plano prescrito. Próxima avaliação sugerida em 4 semanas.",
                        proximaAvaliacao: proxAvaliacao,
                        utenteId: maria.id
                    },
                    {
                        data: new Date("2026-05-22"),
                        p1: 2, p2: 2, p3: 2, p4: 2,
                        p5: 2, p6: 2, p7: 3, p8: 2, p9: 2, p10: 2,
                        scoreTotal: 21,
                        subScoreViasSuperiores: 8,
                        subScoreViasInferiores: 13,
                        nivelControlo: NivelControlo.PARCIALMENTE_CONTROLADO,
                        interpretacao: "Doença Respiratória Parcialmente Controlada.",
                        recomendacoes: "Indicação para realização de exames complementares. Manter o plano terapêutico e agendar consulta de rotina.",
                        proximaAvaliacao: proxAvaliacao,
                        utenteId: antonio.id
                    }
                ]);
                console.log("Dados históricos do CARAT semeados com sucesso!");
            }
        }

        // Alertas Clínicos Simulados
        const alertaRepo = AppDataSource.getRepository(Alerta);
        if (await alertaRepo.count() === 0) {
            const maria = await utenteRepo.findOneBy({ numeroUtente: 123456789 });
            const antonio = await utenteRepo.findOneBy({ numeroUtente: 987654321 });

            if (maria && antonio) {            
                await alertaRepo.save([
                    {
                        utenteId: maria.id,
                        medicoResponsavelId: 1,
                        tipoAlerta: TipoAlerta.REVISAOTERAPEUTICA,
                        estado: AlertaEstado.NOVO,
                        prioridade: AlertaPrioridade.ALTA,
                        motivo: "Score CARAT abaixo do limiar. Utente Maria Laurentina apresenta queixas de dispneia ligeira."
                    },
                    {
                        utenteId: maria.id,
                        medicoResponsavelId: 1,
                        tipoAlerta: TipoAlerta.INDICACAOEXAMES,
                        estado: AlertaEstado.FECHADO,
                        prioridade: AlertaPrioridade.BAIXA,
                        motivo: "Sintoma persistente de tosse noturna reportado no diário clínico."
                    }
                ]);
                console.log("Alertas clínicos simulados criados com sucesso!");
            }
        }

        app.listen(3000, () =>
            console.log("Servidor (TypeORM + SQLite) a correr na porta 3000")
        );
    }).catch((error) => {
        console.error("Erro fatal ao iniciar a Base de Dados:", error);
        process.exit(1);     
    });
}

export default app;