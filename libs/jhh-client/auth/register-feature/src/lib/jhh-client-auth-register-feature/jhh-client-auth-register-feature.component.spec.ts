import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientAuthRegisterFeatureComponent } from './jhh-client-auth-register-feature.component';

describe('JhhClientAuthRegisterFeatureComponent', () => {
  let component: JhhClientAuthRegisterFeatureComponent;
  let fixture: ComponentFixture<JhhClientAuthRegisterFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientAuthRegisterFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientAuthRegisterFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
