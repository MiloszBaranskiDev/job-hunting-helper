import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from 'libs/jhh-client/dashboard/feature-breadcrumbs/src/lib/components/links/nav.component';

describe('LinksComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
