import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardList } from './wizard-list';

describe('WizardList', () => {
  let component: WizardList;
  let fixture: ComponentFixture<WizardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardList],
    }).compileComponents();

    fixture = TestBed.createComponent(WizardList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
