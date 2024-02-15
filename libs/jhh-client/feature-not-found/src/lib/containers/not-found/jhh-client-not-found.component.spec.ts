import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientNotFoundComponent } from './jhh-client-not-found.component';

describe('JhhClientNotFoundComponent', () => {
  let component: JhhClientNotFoundComponent;
  let fixture: ComponentFixture<JhhClientNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientNotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
