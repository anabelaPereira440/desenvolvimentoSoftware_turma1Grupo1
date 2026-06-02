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
  // Parcialmente Controlada — sem alerta gerado, apenas recomendação textual (default: 24)
  @Column({ type: 'float', default: 24 })
  limiarScoreParaRecomendarExame!: number;

  // Semanas até à próxima avaliação quando doença Controlada (default: 4 semanas)
  @Column({ type: 'int', default: 4 })
  proximaAvaliacaoSemanas!: number;

  // Semanas até à próxima avaliação quando doença Parcialmente Controlada (default: 3 semanas)
  @Column({ type: 'int', default: 3 })
  proximaAvaliacaoSemanasParcialmControlo!: number;

  // Semanas até à próxima avaliação quando doença Não Controlada (default: 2 semanas)
  @Column({ type: 'int', default: 2 })
  proximaAvaliacaoSemanasNaoControlado!: number;

  @UpdateDateColumn()
  ultimaAtualizacao!: Date;
}
