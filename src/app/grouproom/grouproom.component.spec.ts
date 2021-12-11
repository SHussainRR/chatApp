import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouproomComponent } from './grouproom.component';

describe('GrouproomComponent', () => {
  let component: GrouproomComponent;
  let fixture: ComponentFixture<GrouproomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrouproomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouproomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
