import express from 'express';
import { AppDataSource } from './database/database';

//Importação das Entidades
import { User } from './models/user.entity';
import { Utente } from './models/utente.entity';
import { Medico } from './models/medico.entity';
import { Prescricao } from './models/prescricao.entity';
import { Exame } from './models/exame.entity';

//Importação das Rotas
import authRoutes from './routes/auth.routes'; 
import utenteRoutes from './routes/utente.routes';
import medicoRoutes from './routes/medico.routes';
import exameRoutes from './routes/exame.routes';
import prescricaoRoutes from './routes/prescricao.routes';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/utente', utenteRoutes);
app.use ('/medico', medicoRoutes);
app.use('/exames', exameRoutes);
app.use('/prescricoes', prescricaoRoutes);

//Inicialização da base de dados e servidor
if (require.main === module) {
    AppDataSource.initialize().then(async () => { 
        console.log ("Base de Dados SQLite conectada com sucesso!");

        //Utilizadores Simulados
        const userRepo = AppDataSource.getRepository(User);
        if (await userRepo.count() === 0) {
            await userRepo.save({
                username: 'Jorge Almeida',
                password: 'password123',
                role: 'medico'
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

        //Prescrições Simuladas
        const prescricaoRepo = AppDataSource.getRepository(Prescricao);
        if (await prescricaoRepo.count() === 0) {
            await prescricaoRepo.save({
                medicamento: 'Aspirina',
                dose: '500mg',
                medico_nome: 'Dr. House',
                dataCriacao: new Date()
            });
        }

        //Exames Simulados
        const exameRepo = AppDataSource.getRepository(Exame);
        if (await exameRepo.count() === 0) {
            await exameRepo.save({
                nome: 'RX Torax',
                codigo: 'RX01',
                medico_nome: 'Dr. House',
                dataCriacao: new Date()
            });
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