import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaCards } from './materia-cards';

describe('MateriaCards', () => {
  let component: MateriaCards;
  let fixture: ComponentFixture<MateriaCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriaCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
