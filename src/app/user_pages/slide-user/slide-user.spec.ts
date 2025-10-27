import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideUser } from './slide-user';

describe('SlideUser', () => {
  let component: SlideUser;
  let fixture: ComponentFixture<SlideUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
