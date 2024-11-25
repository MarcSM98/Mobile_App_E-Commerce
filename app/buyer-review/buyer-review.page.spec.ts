import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyerReviewPage } from './buyer-review.page';

describe('BuyerReviewPage', () => {
  let component: BuyerReviewPage;
  let fixture: ComponentFixture<BuyerReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyerReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
