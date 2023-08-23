import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientShellComponent } from './jhh-client-shell.component';

describe('JhhClientShellComponent', () => {
  let component: JhhClientShellComponent;
  let fixture: ComponentFixture<JhhClientShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
