
export enum NotificationStatus {
  PENDING = 'Pendente',
  SENT_TO_AREA = 'Enviado para Área',
  ANALYZING = 'Em Análise',
  COMPLETED = 'Concluído',
  OVERDUE = 'Atrasado',
  ARCHIVED = 'Arquivado'
}

export enum IncidentClassification {
  NON_CONFORMITY = 'Não conformidade',
  RISK_CIRCUMSTANCE = 'Circunstância de risco',
  NOT_APPLICABLE = 'Não se aplica',
  NO_HARM_INCIDENT = 'Incidente sem dano',
  HARM_INCIDENT = 'Incidente com dano',
  NEAR_MISS = 'Quase erro (near miss)'
}

export interface ActionPlan {
  what: string;
  how: string;
  why: string;
  who: string;
  where: string;
  when: string;
  cost: string;
  objective: string;
}

export interface IshikawaDetails {
  cause: string;
  details: string;
}

export interface IshikawaData {
  maoDeObra: IshikawaDetails;
  maquinas: IshikawaDetails;
  materiais: IshikawaDetails;
  metodos: IshikawaDetails;
  ambiente: IshikawaDetails;
  medida: IshikawaDetails;
}

export interface Notification {
  id: string;
  notificationNumber: number;
  origin: 'Portal' | 'Qr Code' | 'Manual';
  month: string;
  year: number;
  incidentDate: string;
  notificationDate: string;
  period: 'Durante o dia (07h às 19h)' | 'Durante a noite (19h às 07h)';
  reportingSector: string;
  notifiedSector: string;
  patientRA: string;
  patientName: string;
  patientDOB: string;
  incidentType: string;
  classification: IncidentClassification;
  damageGrade: 'Grave' | 'Leve' | 'Moderado' | 'Não se aplica' | 'Nenhum' | 'Óbito';
  carePhase: string;
  identificationMethod: string;
  description: string;
  professionalCategory: string;
  isSentToArea: boolean;
  farmacoHemoTecno?: string;
  involvedPeople?: string;
  deadline?: string;
  status: NotificationStatus;
  ishikawa?: IshikawaData;
  actionPlan?: ActionPlan;
  protocolLondonRequired?: boolean;
  protocolLondonLink?: string;
  notivisaNotified: 'Sim' | 'Não';
  onaNotified: 'Sim' | 'Não';
  createdAt: number;
  priorityRequested?: boolean;
  closedWithoutAction?: boolean;
}

export interface Sector {
  id: string;
  name: string;
  active: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Dynamic role ID
  sectors: string[]; // Dynamic sector IDs
  active: boolean;
}
