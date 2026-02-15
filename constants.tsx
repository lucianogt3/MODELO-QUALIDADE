
import React from 'react';
import { 
  Users, 
  Settings, 
  Package, 
  FileText, 
  Layout, 
  BarChart4 
} from 'lucide-react';

export const SECTORS = [
  'Auditoria', 'NIR', 'SCIH', 'Unidade 4° andar', 'Unidade 2° andar', 
  'UTI isolamento', 'Pronto Socorro', 'UTI cirúrgica', 'Farmácia', 
  'UTI clínica', 'CME', 'Faturamento', 'Unidade 1° andar', 'Qualidade', 
  'OPME', 'Corpo Clínico', 'Diagnóstico por Imagem', 'Manutenção', 
  'Equipe de Anestesia', 'Serviço de Nutrição e Dietética', 'Condutores', 
  'Unidade Térreo', 'Fisioterapia', 'TI', 'Recursos Humanos', 
  'Recepção pronto socorro', 'Recepção pré cirúrgica', 'Departamento Pessoal', 
  'Portaria de Visitas', 'Engenharia Clínica', 'Hemodinâmica', 'SESMT', 
  'Pré faturamento', 'CAF', 'Autorização', 'Comissão de Residência Médica', 
  'Cardiologia', 'Diretoria', 'Ambulatório', 'Compras', 'Almoxarifado', 
  'Patrimônio', 'Banco de Sangue', 'Comitê Transfusional', 'Ouvidoria', 
  'Lavanderia', 'Engenharia civil', 'Psicologia', 'Fonoaudiologia', 
  'Educação permanente', 'Comissão de Ética de Enfermagem'
];

export const INCIDENT_TYPES = [
  'Falha nas atividades administrativas', 'Não procedente', 
  'Falha durante a assistência à saúde', 'Falha na documentação', 
  'Quebra de contrato', 'Quebra de protocolo', 
  'Falha relacionado a material/ medicamento ou insumo', 
  'Falhas envolvendo sondas', 'Falha na comunicação', 
  'Falha na administração de medicamentos', 'Falha na administração de dietas', 
  'Falha envolvendo equipamentos', 'Falha na identificação do paciente', 
  'Falhas envolvendo cateter venoso', 'Falhas ocorridas em laboratórios clínicos', 
  'Falhas na assistência radiológica', 'Lesão por pressão', 'Queda do paciente', 
  'IRAS', 'Flebite', 'Lesão de pele', 'Falha em reconhecer sinais e sintomas de deterioração', 
  'Acidente de trabalho', 'Reação transfusional', 'Falha na infraestrutura', 
  'Parada cardiorrespiratória', 'Incidentes envolvendo intubação traqueal', 
  'Falhas no cuidado e proteção do paciente', 'Falhas na administração de O2 ou gases medicinais', 
  'Falhas envolvendo drenos', 'Pneumotórax', 'Falha por pressão relacionado ao uso de dispositivo', 
  'Falhas envolvendo tubo endotraqueal', 'Extravasamento', 'Broncoaspiração', 
  'Queimaduras', 'Extubação endotraqueal acidental', 'Dermatite', 
  'Readmissão em até 30 dias de alta', 'Reação medicamentosa', 'Lesão de pele por fricção'
];

export const MONTHS = [
  'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 
  'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'
];

export const ISHIKAWA_CATEGORIES = [
  { 
    id: 'maoDeObra', 
    label: 'MÃO DE OBRA (Pessoas)', 
    icon: <Users className="w-5 h-5" />, 
    causes: [
      'Déficit de dimensionamento de enfermagem',
      'Sobrecarga de trabalho',
      'Fadiga / jornada excessiva',
      'Falta de treinamento específico',
      'Falta de capacitação técnica',
      'Comunicação ineficaz entre equipe',
      'Falha na passagem de plantão',
      'Não adesão a protocolos',
      'Desconhecimento de fluxos institucionais',
      'Alta rotatividade de profissionais',
      'Falta de supervisão',
      'Liderança ausente',
      'Desmotivação da equipe',
      'Profissional recém-contratado sem integração adequada'
    ]
  },
  { 
    id: 'maquinas', 
    label: 'MÁQUINAS (Equipamentos)', 
    icon: <Settings className="w-5 h-5" />, 
    causes: [
      'Equipamento com defeito',
      'Manutenção preventiva vencida',
      'Falta de calibração',
      'Falha elétrica',
      'Equipamento inadequado para o procedimento',
      'Alarme não configurado corretamente',
      'Falta de treinamento no uso do equipamento',
      'Tecnologia obsoleta',
      'Falha de software',
      'Falta de backup de equipamento'
    ]
  },
  { 
    id: 'materiais', 
    label: 'MATERIAIS', 
    icon: <Package className="w-5 h-5" />, 
    causes: [
      'Falta de insumos',
      'Material vencido',
      'Armazenamento inadequado',
      'Identificação incorreta',
      'Medicamento com embalagem semelhante',
      'Erro na dispensação',
      'Lote com problema',
      'Material de baixa qualidade',
      'Falta de rastreabilidade',
      'Erro na separação do material'
    ]
  },
  { 
    id: 'metodos', 
    label: 'MÉTODOS (Processos)', 
    icon: <FileText className="w-5 h-5" />, 
    causes: [
      'Protocolo inexistente',
      'Protocolo desatualizado',
      'Fluxo mal definido',
      'Ausência de checklist',
      'Falta de dupla checagem',
      'Processo não padronizado',
      'Falha na validação de prescrição',
      'Falta de barreiras de segurança',
      'Mudança recente de processo sem treinamento',
      'Ausência de auditoria interna'
    ]
  },
  { 
    id: 'ambiente', 
    label: 'AMBIENTE', 
    icon: <Layout className="w-5 h-5" />, 
    causes: [
      'Ambiente superlotado',
      'Ruído excessivo',
      'Iluminação inadequada',
      'Espaço físico reduzido',
      'Interrupções frequentes',
      'Pressão assistencial elevada',
      'Clima organizacional negativo',
      'Temperatura inadequada',
      'Layout inadequado da unidade',
      'Circulação excessiva de pessoas'
    ]
  },
  { 
    id: 'medida', 
    label: 'MEDIDA (Indicadores / Monitoramento)', 
    icon: <BarChart4 className="w-5 h-5" />, 
    causes: [
      'Indicadores não monitorados',
      'Dados inconsistentes',
      'Subnotificação de eventos',
      'Falta de cultura de segurança',
      'Ausência de análise crítica periódica',
      'Indicadores não divulgados à equipe',
      'Falta de auditoria',
      'Metas mal definidas',
      'Ausência de feedback estruturado',
      'Falta de plano de ação após análise'
    ]
  }
];
