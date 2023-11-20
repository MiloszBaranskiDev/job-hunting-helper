import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatedNotesComponent } from './related-notes.component';

describe('RelatedNotesComponent', () => {
  let component: RelatedNotesComponent;
  let fixture: ComponentFixture<RelatedNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
