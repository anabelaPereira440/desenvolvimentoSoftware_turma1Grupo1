import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.listen(3000, () => console.log("Servidor a correr na porta 3000"));

export default app;