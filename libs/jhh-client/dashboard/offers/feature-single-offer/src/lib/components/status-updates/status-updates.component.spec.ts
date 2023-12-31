import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusUpdatesComponent } from './status-updates.component';

describe('StatusUpdatesComponent', () => {
  let component: StatusUpdatesComponent;
  let fixture: ComponentFixture<StatusUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusUpdatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
