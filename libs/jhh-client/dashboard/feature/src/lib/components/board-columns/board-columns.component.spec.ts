import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardColumnsComponent } from './board-columns.component';

describe('BoardColumnsComponent', () => {
  let component: BoardColumnsComponent;
  let fixture: ComponentFixture<BoardColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardColumnsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
