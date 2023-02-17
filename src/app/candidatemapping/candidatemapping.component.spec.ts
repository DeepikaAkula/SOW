import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatemappingComponent } from './candidatemapping.component';

describe('CandidatemappingComponent', () => {
  let component: CandidatemappingComponent;
  let fixture: ComponentFixture<CandidatemappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidatemappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
