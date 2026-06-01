import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

// Singleton: existe apenas um registo de configuração no sistema, gerido pelo administrador.
@Entity()
export class Configuracao {
  @PrimaryGeneratedColumn()
  id!: number;

  // Score total (0-30) abaixo ou igual ao qual a doença é considerada Não Controlada
  // e é gerado um alerta de Revisão Terapêutica (default: 19)
  @Column({ type: 'float', default: 19 })
  limiarMinimoScore!: number;

  // Queda de pontos em relação à avaliação anterior que dispara um alerta de Deterioração
  // (default: 4 pontos de queda)
  @Column({ type: 'float', default: 4 })
  deterioracaoScore!: number;

  // Score total abaixo ou igual ao qual (e acima de limiarMinimoScore) a doença é considerada
  // Parcialmente Controlada e é gerada recomendação de Indicação de Exame (default: 24)
  @Column({ type: 'float', default: 24 })
  limiarScoreParaRecomendarExame!: number;

  // Número de semanas até à próxima avaliação CARAT sugerida (default: 4 semanas)
  @Column({ type: 'int', default: 4 })
  proximaAvaliacaoSemanas!: number;

  @UpdateDateColumn()
  ultimaAtualizacao!: Date;
}
