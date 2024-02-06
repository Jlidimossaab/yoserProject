import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterCategorieComponent } from './consulter-categorie.component';

describe('ConsulterCategorieComponent', () => {
  let component: ConsulterCategorieComponent;
  let fixture: ComponentFixture<ConsulterCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsulterCategorieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulterCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
