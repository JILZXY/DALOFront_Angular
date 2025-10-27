import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaAbogado } from './estadistica-abogado';

describe('EstadisticaAbogado', () => {
  let component: EstadisticaAbogado;
  let fixture: ComponentFixture<EstadisticaAbogado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticaAbogado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticaAbogado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
