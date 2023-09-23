import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupsListComponent } from 'libs/jhh-client/dashboard/notes/notes-groups/src/lib/feature/components/groups-list/groups-list.component';

describe('NotesGroupsListComponent', () => {
  let component: GroupsListComponent;
  let fixture: ComponentFixture<GroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
