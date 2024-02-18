import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleEventsComponent } from './schedule-events.component';

describe('ScheduleEventsComponent', () => {
  let component: ScheduleEventsComponent;
  let fixture: ComponentFixture<ScheduleEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleEventsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
