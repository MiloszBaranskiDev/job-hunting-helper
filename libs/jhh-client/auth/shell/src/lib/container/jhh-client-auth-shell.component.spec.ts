import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientAuthShellComponent } from './jhh-client-auth-shell.component';

describe('JhhClientAuthShellComponent', () => {
  let component: JhhClientAuthShellComponent;
  let fixture: ComponentFixture<JhhClientAuthShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientAuthShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientAuthShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
