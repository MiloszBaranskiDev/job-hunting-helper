import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientSharedUiToolbarComponent } from './jhh-client-shared-ui-toolbar.component';

describe('JhhClientSharedUiToolbarComponent', () => {
  let component: JhhClientSharedUiToolbarComponent;
  let fixture: ComponentFixture<JhhClientSharedUiToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientSharedUiToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientSharedUiToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
