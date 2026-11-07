import express from 'express';
import authRoutes from './routes/authRoutes';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'API rodando com sucesso!' });
});

app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.use(express.static(path.join(__dirname, '../public')));