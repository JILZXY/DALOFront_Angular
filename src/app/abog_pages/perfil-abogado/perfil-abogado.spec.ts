import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAbogado } from './perfil-abogado';

describe('PerfilAbogado', () => {
  let component: PerfilAbogado;
  let fixture: ComponentFixture<PerfilAbogado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilAbogado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilAbogado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
