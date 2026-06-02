import { Router } from 'express';
import { getObservationsFromFhir } from '../services/fhir.service';

const router = Router();

router.get('/observations', async (req, res) => {
  try {
    const code = typeof req.query.code === 'string' && req.query.code.trim() !== ''
      ? req.query.code
      : '9279-1'; // Fallback para monitorização respiratória

    const patient = typeof req.query.patient === 'string'
      ? req.query.patient
      : undefined;

    const observations = await getObservationsFromFhir(code, patient);

    res.json(observations);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Erro ao consultar o servidor FHIR de Portugal.'
    });
  }
});

export default router;