import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionComponent } from 'libs/jhh-client/dashboard/offers/feature-single-offer/src/lib/components/description/description.component';

describe('ContentComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
