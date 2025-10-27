import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAbo } from './registro-abo';

describe('RegistroAbo', () => {
  let component: RegistroAbo;
  let fixture: ComponentFixture<RegistroAbo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAbo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroAbo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
