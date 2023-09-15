import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientSharedUiSidebarComponent } from './jhh-client-shared-ui-sidebar.component';

describe('JhhClientSharedUiSidebarComponent', () => {
  let component: JhhClientSharedUiSidebarComponent;
  let fixture: ComponentFixture<JhhClientSharedUiSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientSharedUiSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientSharedUiSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
