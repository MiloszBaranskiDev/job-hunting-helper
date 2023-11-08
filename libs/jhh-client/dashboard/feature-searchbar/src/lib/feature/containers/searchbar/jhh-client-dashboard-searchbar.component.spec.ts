import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardSearchbarComponent } from './jhh-client-dashboard-searchbar.component';

describe('JhhClientDashboardSearchbarComponent', () => {
  let component: JhhClientDashboardSearchbarComponent;
  let fixture: ComponentFixture<JhhClientDashboardSearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardSearchbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
