import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDateComponent } from './view-date.component';

describe('ViewDateComponent', () => {
  let component: ViewDateComponent;
  let fixture: ComponentFixture<ViewDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
