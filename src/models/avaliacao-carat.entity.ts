import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { NivelControlo } from '../enums/NivelControlo.enum';
import { Utente } from './utente.entity';

/*
 * Questionário CARAT (Control of Allergic Rhinitis and Asthma Test)
 *
 * 10 perguntas divididas em dois grupos:
 *   - Vias Superiores (rhinite) : p1–p4   (sub-score máximo: 12)
 *   - Vias Inferiores (asma)    : p5–p10  (sub-score máximo: 18)
 *
 * Cada resposta: 0 (pior) → 3 (melhor controlo)
 * Score total: 0–30
 *
 * Limiares (configuráveis por administrador via Configuracao):
 *   score ≤ limiarMinimoScore              → NAO_CONTROLADO      → alerta Revisão Terapêutica
 *   limiarMinimo < score ≤ limiarExame     → PARCIALMENTE_CONTROLADO → alerta Indicação de Exame
 *   score > limiarExame                    → CONTROLADO           → sem alerta
 */
@Entity()
@Index(['utenteId', 'data'])
export class AvaliacaoCarat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  data!: Date;

  // --- Respostas (0 = pior / 3 = melhor) ---

  // Vias Superiores (rhinite) — perguntas 1 a 4
  @Column({ type: 'int' })
  p1!: number;

  @Column({ type: 'int' })
  p2!: number;

  @Column({ type: 'int' })
  p3!: number;

  @Column({ type: 'int' })
  p4!: number;

  // Vias Inferiores (asma) — perguntas 5 a 10
  @Column({ type: 'int' })
  p5!: number;

  @Column({ type: 'int' })
  p6!: number;

  @Column({ type: 'int' })
  p7!: number;

  @Column({ type: 'int' })
  p8!: number;

  @Column({ type: 'int' })
  p9!: number;

  @Column({ type: 'int' })
  p10!: number;

  // --- Scores calculados ---

  @Column({ type: 'int' })
  scoreTotal!: number;

  @Column({ type: 'int' })
  subScoreViasSuperiores!: number;

  @Column({ type: 'int' })
  subScoreViasInferiores!: number;

  // --- Interpretação ---

  // Nível de controlo determinado automaticamente com base nos limiares da Configuracao
  @Column({
    type: 'simple-enum',
    enum: NivelControlo,
  })
  nivelControlo!: NivelControlo;

  // Texto descritivo do resultado para apresentação ao utente
  @Column({ type: 'text' })
  interpretacao!: string;

  // Texto resumido das recomendações para apresentação ao utente
  @Column({ type: 'text' })
  recomendacoes!: string;

  // Data sugerida para a próxima avaliação (intervalo varia com o nível de controlo)
  @Column({ type: 'date', nullable: true })
  proximaAvaliacao?: Date;

  // Limiares da Configuração vigentes no momento desta avaliação (para rastreabilidade histórica)
  @Column({ type: 'float' })
  limiarMinimoScoreUsado!: number;

  @Column({ type: 'float' })
  limiarScoreParaRecomendarExameUsado!: number;

  // --- Relação com o utente ---

  @Column()
  utenteId!: number;

  @ManyToOne(() => Utente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utenteId' })
  utente!: Utente;
}
