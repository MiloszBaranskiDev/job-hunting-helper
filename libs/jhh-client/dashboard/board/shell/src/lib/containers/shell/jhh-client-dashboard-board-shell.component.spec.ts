import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardBoardShellComponent } from 'libs/jhh-client/dashboard/board/shell/src/lib/containers/shell/jhh-client-dashboard-board-shell.component';

describe('JhhClientDashboardBoardShellComponentComponent', () => {
  let component: JhhClientDashboardBoardShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardBoardShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardBoardShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardBoardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
