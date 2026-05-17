import express from 'express';
import path from 'path';
import utenteRoutes from './routes/utente.routes';


const app = express();

app.use(express.json());
app.use('/utente', utenteRoutes);


app.listen(3000, () => console.log("Servidor a correr na porta 3000"));

export default app;