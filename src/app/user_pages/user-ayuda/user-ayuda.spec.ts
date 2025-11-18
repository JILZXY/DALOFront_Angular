import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAyuda } from './user-ayuda';

describe('UserAyuda', () => {
  let component: UserAyuda;
  let fixture: ComponentFixture<UserAyuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAyuda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAyuda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
