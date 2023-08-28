import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientAuthLoginFeatureComponent } from './jhh-client-auth-login-feature.component';

describe('JhhClientAuthLoginFeatureComponent', () => {
  let component: JhhClientAuthLoginFeatureComponent;
  let fixture: ComponentFixture<JhhClientAuthLoginFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientAuthLoginFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientAuthLoginFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
