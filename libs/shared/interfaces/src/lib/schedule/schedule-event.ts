export interface ScheduleEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  title: string;
  color: string;
  description?: string;
}
