import { ObservationDTO } from '../dtos/fhir/ObservationDTO';
import { mapObservationHumanData } from '../mappers/fhir-observation.mapper';

const FHIR_BASE_URL = 'https://fhir.hl7.pt/r5/fhir';

export async function getObservationsFromFhir(
  code: string = '9279-1', // Defeito do BreathCare: Frequência Respiratória
  patient?: string
): Promise<ObservationDTO[]> {
  let url = `${FHIR_BASE_URL}/Observation?code=${encodeURIComponent(code)}`;

  if (patient) {
    url += `&subject=Patient/${patient}`;
  }

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`Erro FHIR: ${resposta.status}`);
  }

  const bundle = await resposta.json();

  // Usamos a função de mapeamento com data em formato PT-PT
  return bundle.entry?.map((entry: any) => mapObservationHumanData(entry.resource)) || [];
}