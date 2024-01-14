import addEvent from './add-event';
import removeEvent from './remove-event';

export function JhhServerControllerSchedule() {
  return {
    addEvent,
    removeEvent,
  };
}
