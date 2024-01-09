import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDateToggleComponent } from './view-date-toggle.component';

describe('ViewDateToggleComponent', () => {
  let component: ViewDateToggleComponent;
  let fixture: ComponentFixture<ViewDateToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDateToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDateToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
