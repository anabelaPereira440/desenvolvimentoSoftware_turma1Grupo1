import express from 'express';
import path from 'path';
import { AppDataSource } from './database/database';
import bcrypt from 'bcryptjs';
import { Log } from './models/log.entity';
import authRoutes from './routes/auth.routes';

//Importação das Entidades
import { Utilizador } from './models/utilizador.entity';
import { Utente } from './models/utente.entity';
import { Medico } from './models/medico.entity';
import { Prescricao } from './models/prescricao.entity';
import { Exame } from './models/exame.entity';
import { AvaliacaoCarat } from './models/avaliacao-carat.entity';
import { Alerta } from './models/alerta.entity';
import { AlertaEstado, AlertaPrioridade, TipoAlerta } from './models/alerta.entity';

//Importação das Rotas
import utenteRoutes from './routes/utente.routes';
import medicoRoutes from './routes/medico.routes';
import exameRoutes from './routes/exame.routes';
import prescricaoRoutes from './routes/prescricao.routes';
import caratRoutes from './routes/carat.routes';
import alertaRoutes from './routes/alerta.routes'; 

const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use('/utente', utenteRoutes);
app.use ('/medico', medicoRoutes);
app.use('/exames', exameRoutes);
app.use('/prescricoes', prescricaoRoutes);
app.use('/utente', caratRoutes); // Vincula o CARAT ao prefixo /utente, resultando em /utente/:id/carat!
app.use('/alertas', alertaRoutes); // Ativa os endpoints de alertas

//Inicialização da base de dados e servidor
if (require.main === module) {
    AppDataSource.initialize().then(async () => { 
        console.log ("Base de Dados SQLite conectada com sucesso!");

        //Utilizadores Simulados
        const userRepo = AppDataSource.getRepository(Utilizador);
        if (await userRepo.count() === 0) {
        const passwordHash = await bcrypt.hash('123456', 10);

            await userRepo.save([
                {
                nome: 'Administrador',
                username: 'admin',
                password: passwordHash,
                role: 'ADMIN'
                },
                {
                nome: 'Jorge Almeida',
                username: 'jorge.almeida',
                password: passwordHash,
                role: 'MEDICO'
                },
                {
                nome: 'Maria Laurentina',
                username: 'maria.laurentina',
                password: passwordHash,
                role: 'UTENTE'
                }
            ]);
        console.log('Utilizadores simulados criados (password de todos: 123456)');
        }

        //Médicos Simulados
        const medicoRepo = AppDataSource.getRepository(Medico);
        if (await medicoRepo.count() === 0) {
            await medicoRepo.save({
                id: 1,
                nome: 'Jorge Almeida',
                especialidade: 'Pneumologia',
                cedulaProfissional: 12345,
                dataNascimento: new Date("1970-05-15"),
                sexo: "Masculino",
                contacto: "960000000"
            }); 
        }
        
        //Utentes Simulados
        const utenteRepo = AppDataSource.getRepository(Utente);
        if (await utenteRepo.count() === 0) {
            await utenteRepo.save([
            { 
                nome: "Maria Laurentina", 
                numeroUtente: 123456789, 
                dataNascimento: new Date("1965-04-12"), 
                sexo: "Feminino", 
                contacto: "912345678", 
                medicoId: 1 
            },
            { 
                nome: "António Silva", 
                numeroUtente: 987654321, 
                dataNascimento: new Date("1958-11-23"), 
                sexo: "Masculino", 
                contacto: "934567890", 
                medicoId: 1 
            }
            ]);
        }

        //Prescrições Simuladas
        const prescricaoRepo = AppDataSource.getRepository(Prescricao);
        if (await prescricaoRepo.count() === 0) {
            const maria = await utenteRepo.findOneBy({ numeroUtente: 123456789 });
            if (maria){
                const dataCriacaoSimulada = new Date(); 
                const dataValidadeSimulada = new Date();
                dataValidadeSimulada.setDate(dataCriacaoSimulada.getDate() + 180);
                
                await prescricaoRepo.save({
                    medicamento: 'Aspirina',
                    dose: '500mg',
                    medico_nome: 'Jorge Almeida',
                    utenteId: maria.id,
                    dataCriacao: dataCriacaoSimulada,
                    dataValidade: dataValidadeSimulada
                });
            }
        }

        //Exames Simulados
        const exameRepo = AppDataSource.getRepository(Exame);
        if (await exameRepo.count() === 0) {
            const antonio = await utenteRepo.findOneBy({ numeroUtente: 987654321 });
            if (antonio){
                const dataCriacaoSimulada = new Date(); 
                const dataValidadeSimulada = new Date();
                dataValidadeSimulada.setDate(dataCriacaoSimulada.getDate() + 180);
                
                await exameRepo.save({
                    nome: 'RX Torax',
                    codigo: 'RX01',
                    medico_nome: 'Jorge Almeida',
                    utenteId: antonio.id,
                    dataCriacao: dataCriacaoSimulada,
                    dataValidade: dataValidadeSimulada
                });
            }
        }
        
        //Dados CARAT Simulados
        const caratRepo = AppDataSource.getRepository(AvaliacaoCarat);
        if (await caratRepo.count() === 0) {
            
            const maria = await utenteRepo.findOneBy({ numeroUtente: 123456789 });
            const antonio = await utenteRepo.findOneBy({ numeroUtente: 987654321 });

            if (maria && antonio) {
                await caratRepo.save([
                    // 1. Avaliação antiga da Maria (Doença Não Controlada - Score Total = 11)
                    {
                        data: new Date("2026-04-10"),
                        p1: 1, p2: 1, p3: 1, p4: 1, // Vias Superiores = 4
                        p5: 1, p6: 2, p7: 1, p8: 1, p9: 1, p10: 1, // Vias Inferiores = 7
                        scoreTotal: 11,
                        subScoreViasSuperiores: 4,
                        subScoreViasInferiores: 7,
                        interpretacao: "Doença Respiratória Não Controlada (Controlo Insuficiente).",
                        recomendacoes: "Revisão terapêutica urgente com o seu médico. Reforçar medidas de autocuidado e vigilância de sintomas severos.",
                        utenteId: maria.id
                    },
                    // 2. Avaliação recente da Maria (Doença Controlada - Score Total = 25)
                    {
                        data: new Date("2026-05-20"),
                        p1: 3, p2: 3, p3: 2, p4: 3, // Vias Superiores = 11
                        p5: 3, p6: 2, p7: 2, p8: 3, p9: 2, p10: 2, // Vias Inferiores = 14
                        scoreTotal: 25,
                        subScoreViasSuperiores: 11,
                        subScoreViasInferiores: 14,
                        interpretacao: "Doença Respiratória Controlada.",
                        recomendacoes: "Excelente estado clínico! Continue com o plano prescrito. Próxima avaliação sugerida em 3 meses.",
                        utenteId: maria.id
                    },
                    // 3. Avaliação do António (Doença Parcialmente Controlada - Score Total = 21)
                    {
                        data: new Date("2026-05-22"),
                        p1: 2, p2: 2, p3: 2, p4: 2, // Vias Superiores = 8
                        p5: 2, p6: 2, p7: 3, p8: 2, p9: 2, p10: 2, // Vias Inferiores = 13
                        scoreTotal: 21,
                        subScoreViasSuperiores: 8,
                        subScoreViasInferiores: 13,
                        interpretacao: "Doença Respiratória Parcialmente Controlada.",
                        recomendacoes: "Manter o plano terapêutico habitual e agendar uma consulta de rotina para avaliação contínua.",
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
                        utenteId: maria.id,            // Maria Laurentina
                        medicoResponsavelId: "1",           // Associado ao médico id 1 
                        tipoAlerta: TipoAlerta.SCOREABAIXOLIMIAR,
                        estado: AlertaEstado.NOVO,
                        prioridade: AlertaPrioridade.ALTA,
                        motivo: "Score CARAT abaixo do limiar. Utente Maria Laurentina apresenta queixas de dispneia ligeira."
                    },
                    {
                        utenteId: antonio.id,            // António Silva
                        medicoResponsavelId: "1",
                        tipoAlerta: TipoAlerta.DETERIORACAOSCORE,
                        estado: AlertaEstado.VISTO,
                        prioridade: AlertaPrioridade.MEDIA,
                        motivo: "Deterioração significativa do score CARAT em relação ao mês anterior."
                    },
                    {
                        utenteId: maria.id,            // Maria Laurentina
                        medicoResponsavelId: "1",
                        tipoAlerta: TipoAlerta.SINTOMAPERSISTENTE,
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
    })
    .catch((error) => {
            console.error("Erro fatal ao iniciar a Base de Dados:", error);
            process.exit(1);     
    });
}
export default app;