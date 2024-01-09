import { ScheduleEvent } from '@jhh/shared/interfaces';

type DefaultScheduleEvent = Omit<
  ScheduleEvent,
  'userId' | 'createdAt' | 'updatedAt' | 'id'
>;

function addDays(date: Date, days: number): Date {
  const result: Date = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDefaultScheduleEvents(today: Date): DefaultScheduleEvent[] {
  return [
    {
      startDate: today,
      endDate: addDays(today, 3),
      title: 'Example 3 day event',
      color: '#e55039',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      startDate: today,
      endDate: addDays(today, 60),
      title: 'Example long event that spans 2 months',
      color: '#6ab04c',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
  ];
}

export default getDefaultScheduleEvents;
