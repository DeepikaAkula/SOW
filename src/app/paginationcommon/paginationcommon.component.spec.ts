import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationcommonComponent } from './paginationcommon.component';

describe('PaginationcommonComponent', () => {
  let component: PaginationcommonComponent;
  let fixture: ComponentFixture<PaginationcommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationcommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationcommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
