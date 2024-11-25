import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'register2',
    loadChildren: () => import('./register2/register2.module').then(m => m.Register2PageModule)
  },
  {
    path: 'featured-products',
    loadChildren: () => import('./featured-products/featured-products.module').then(m => m.FeaturedProductsPageModule)
  },
  {
    path: 'product-details/:id',
    loadChildren: () => import('./product-details/product-details.module').then(m => m.ProductDetailsPageModule)
  },
  {
    path: 'pop-over-share',
    loadChildren: () => import('./pop-over-share/pop-over-share.module').then(m => m.PopOverSharePageModule)
  },
  {
    path: 'reserve-product/:id',
    loadChildren: () => import('./reserve-product/reserve-product.module').then(m => m.ReserveProductPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'seller-details/:id',
    loadChildren: () => import('./seller-details/seller-details.module').then(m => m.SellerDetailsPageModule)
  },
  {
    path: 'seller-review/:id',
    loadChildren: () => import('./seller-review/seller-review.module').then(m => m.SellerReviewPageModule)
  },
  {
    path: 'add-review/:seller/:seller_un/:orderid/:productid',
    loadChildren: () => import('./add-review/add-review.module').then( m => m.AddReviewPageModule)
  },
  {
    path: 'add-review-buyer/:buyer/:buyer_un/:orderid/:productid',      // Change
    loadChildren: () => import('./add-review-buyer/add-review-buyer.module').then( m => m.AddReviewBuyerPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'chat-details/:id',
    loadChildren: () => import('./chat-details/chat-details.module').then( m => m.ChatDetailsPageModule)
  },
  {
    path: 'ads-request',
    loadChildren: () => import('./ads-request/ads-request.module').then( m => m.AdsRequestPageModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('./add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'edit-product/:id',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule)
  },
  {
    path: 'featured-request',
    loadChildren: () => import('./featured-request/featured-request.module').then( m => m.FeaturedRequestPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'sale-statistics/:id',
    loadChildren: () => import('./sale-statistics/sale-statistics.module').then( m => m.SaleStatisticsPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./admin-login/admin-login.module').then( m => m.AdminLoginPageModule)
  },
  {
    path: 'add-announcement',
    loadChildren: () => import('./add-announcement/add-announcement.module').then( m => m.AddAnnouncementPageModule)
  },
  {
    path: 'announcements',
    loadChildren: () => import('./announcements/announcements.module').then( m => m.AnnouncementsPageModule)
  },
  /*{
    path: 'manage-ads-featured-products',
    loadChildren: () => import('./manage-ads-featured-products/manage-ads-featured-products.module').then( m => m.ManageAdsFeaturedProductsPageModule)
  },
  {
    path: 'ads-approval',
    loadChildren: () => import('./ads-approval/ads-approval.module').then( m => m.AdsApprovalPageModule)
  },
  {
    path: 'featured-product-approval',
    loadChildren: () => import('./featured-product-approval/featured-product-approval.module').then( m => m.FeaturedProductApprovalPageModule)
  },*/
  {
    path: 'manage-special-event',
    loadChildren: () => import('./manage-special-event/manage-special-event.module').then( m => m.ManageSpecialEventPageModule)
  },
  {
    path: 'manage-reports',
    loadChildren: () => import('./manage-reports/manage-reports.module').then( m => m.ManageReportsPageModule)
  },
  {
    path: 'manage-users',
    loadChildren: () => import('./manage-users/manage-users.module').then( m => m.ManageUsersPageModule)
  },
  {
    path: 'manage-products',
    loadChildren: () => import('./manage-products/manage-products.module').then( m => m.ManageProductsPageModule)
  },
  {
    path: 'order-details/:id',
    loadChildren: () => import('./order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule)
  },
  {
    path: 'manage-ads-featured-products',
    loadChildren: () => import('./manage-ads-featured-products/manage-ads-featured-products.module').then( m => m.ManageAdsFeaturedProductsPageModule)
  },
  {
    path: 'edit-ads/:id',
    loadChildren: () => import('./edit-ads/edit-ads.module').then( m => m.EditAdsPageModule)
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./terms-conditions/terms-conditions.module').then( m => m.TermsConditionsPageModule)
  },
  // {    
  //   path: 'add-review-buyer',
  //   loadChildren: () => import('./add-review-buyer/add-review-buyer.module').then( m => m.AddReviewBuyerPageModule)
  // },
  {
    path: 'buyer-review/:id',    // Change
    loadChildren: () => import('./buyer-review/buyer-review.module').then( m => m.BuyerReviewPageModule)
  },
  {
    path: 'buyer-details/:id',    // Change
    loadChildren: () => import('./buyer-details/buyer-details.module').then( m => m.BuyerDetailsPageModule)
  },
  {
    path: 'special-events',
    loadChildren: () => import('./special-events/special-events.module').then( m => m.SpecialEventsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
