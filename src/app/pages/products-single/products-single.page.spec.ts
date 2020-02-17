import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSinglePage } from './products-single.page';

describe('ProductsSinglePage', () => {
  let component: ProductsSinglePage;
  let fixture: ComponentFixture<ProductsSinglePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsSinglePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSinglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
