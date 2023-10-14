import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from 'libs/jhh-client/dashboard/notes/edit-note/src/lib/feature/components/dialog/dialog.component';

describe('EditNoteComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
