import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUsuarios } from './chat-usuarios';

describe('ChatUsuarios', () => {
  let component: ChatUsuarios;
  let fixture: ComponentFixture<ChatUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

