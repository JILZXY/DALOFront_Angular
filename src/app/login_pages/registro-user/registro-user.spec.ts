import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUser } from './registro-user';

describe('RegistroUser', () => {
  let component: RegistroUser;
  let fixture: ComponentFixture<RegistroUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
