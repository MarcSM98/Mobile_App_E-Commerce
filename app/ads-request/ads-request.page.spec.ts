import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdsRequestPage } from './ads-request.page';

describe('AdsRequestPage', () => {
  let component: AdsRequestPage;
  let fixture: ComponentFixture<AdsRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdsRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
