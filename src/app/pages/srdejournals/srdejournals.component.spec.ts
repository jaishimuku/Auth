import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrdejournalsComponent } from './srdejournals.component';

describe('SrdejournalsComponent', () => {
  let component: SrdejournalsComponent;
  let fixture: ComponentFixture<SrdejournalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrdejournalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrdejournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
