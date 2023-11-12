import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatedAtComponent } from './updated-at.component';

describe('UpdatedAtComponent', () => {
  let component: UpdatedAtComponent;
  let fixture: ComponentFixture<UpdatedAtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedAtComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatedAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
