import React, { Component, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Admin Route here
const Home = React.lazy(() => import("../screens/home/home"));
const About = React.lazy(() => import("../screens/about/About"));
const tc = React.lazy(() => import("../screens/generalpages/term_condition"));
const faq = React.lazy(() => import("../screens/generalpages/faq"));
const Media_coverage = React.lazy(() =>
  import("../screens/generalpages/Media_coverage")
);
const privicypolicy = React.lazy(() =>
  import("../screens/generalpages/privicypolicy")
);
const Checkout = React.lazy(() => import("../screens/checkout/checkout"));
const Cart = React.lazy(() => import("../screens/cart/cart"));
const Category = React.lazy(() => import("../screens/category/category"));
const Header = React.lazy(() => import("../../src/components/header"));
const Footer = React.lazy(() => import("../../src/components/footer"));
const Thankyou = React.lazy(() => import("../../src/screens/thankyou"));
const failed = React.lazy(() => import("../../src/screens/paymentfailed"));
const addmoneythankyou = React.lazy(() =>
  import("../../src/screens/addmoneythankyou")
);
const ViewDynamicPage = React.lazy(() =>
  import("../../src/screens/ViewDynamicPage/ViewDynamicPage")
);
const account = React.lazy(() => import("../../src/screens/account/login"));
const adminabout = React.lazy(() =>
  import("../../src/view/general_pages/admin_about")
);
const adminprivicy = React.lazy(() =>
  import("../../src/view/general_pages/admin_privicypolicy")
);
const admintermcondition = React.lazy(() =>
  import("../../src/view/general_pages/admin_termcondition")
);
const myprofile = React.lazy(() =>
  import("../../src/screens/account/my-profile")
);
const myseed = React.lazy(() => import("../../src/screens/account/my-Seed"));
const mywallet = React.lazy(() => import("../../src/screens/account/mywallet"));

const myorders = React.lazy(() => import("../../src/screens/account/myorder"));
const manageaddress = React.lazy(() =>
  import("../../src/screens/account/manage-address")
);
const accountdetails = React.lazy(() =>
  import("../../src/screens/account/accountdetails")
);
const contactus = React.lazy(() =>
  import("../../src/screens/contactus/contactus")
);
const sidebar = React.lazy(() =>
  import("../../src/screens/main_sidebar/sidebar")
);
const blog = React.lazy(() => import("../../src/screens/blog/blog"));
const Loyalty_static = React.lazy(() =>
  import("../screens/referral_loyalty/Loyalty_static")
);
const Referral_static = React.lazy(() =>
  import("../screens/referral_loyalty/Referral_static")
);
const Product_details = React.lazy(() =>
  import("../../src/screens/detail_page/product_detail")
);
const configure_product = React.lazy(() =>
  import("../screens/detail_page/configure_product")
);
const Blog_details = React.lazy(() =>
  import("../../src/screens/blog/BlogDetails")
);
const Blog_category = React.lazy(() =>
  import("../../src/screens/blog/Blog_category")
);

const Login = React.lazy(() => import("../view/admin/login"));
const Dashboard = React.lazy(() => import("../view/admin/dashboard"));
const AnalyticDashboard = React.lazy(() =>
  import("../view/admin/analyticdashboard")
);
const adminCategory = React.lazy(() =>
  import("../view/admin/education/Category")
);
const ProductSheet = React.lazy(() =>
  import("../view/admin-setting/ProductSheet")
);
const Coupon = React.lazy(() => import("../view/admin/education/Coupon"));
const site_setting = React.lazy(() => import("../view/admin-setting/setting"));
const additional_setting = React.lazy(() =>
  import("../view/admin-setting/additional_setting")
);
const storehey_setting = React.lazy(() =>
  import("../view/admin-setting/storehey_settings")
);
const paymentApi = React.lazy(() => import("../view/paymentApi/paymentkeys"));
const sms_gateway = React.lazy(() => import("../view/sms_gateway/sms_gateway"));
const delivery_setting = React.lazy(() =>
  import("../view/admin-setting/DeliverySetting")
);
const Logs = React.lazy(() => import("../view/admin-setting/Logs"));
const DynamicPages = React.lazy(() =>
  import("../view/dynamic_pages/DynamicPages")
);
const AddDynamicPages = React.lazy(() =>
  import("../view/dynamic_pages/Add_DynamicPages")
);
const EditDynamicPages = React.lazy(() =>
  import("../view/dynamic_pages/Edit_DynamicPages")
);
const notif_setting = React.lazy(() =>
  import("../view/notif-settings/notif_settings")
);

const email_temp = React.lazy(() =>
  import("../view/emailTemplate/email_templates")
);
const suppliers = React.lazy(() => import("../view/admin/education/suppliers"));
const user = React.lazy(() => import("../view/user/user"));
const orderdetails = React.lazy(() =>
  import("../view/admin/education/orderdetails")
);

// admin - edit - order;
const subscriptiondetails = React.lazy(() =>
  import("../view/admin/education/subscriptiondetails")
);
const reportgeneration = React.lazy(() =>
  import("../view/admin/education/reportgeneration")
);
const slides = React.lazy(() => import("../view/slides/slides"));
const banner = React.lazy(() => import("../view/banner/banner"));
const editorders = React.lazy(() => import("../view/admin/myorder/edit_order"));
const myorder = React.lazy(() => import("../view/admin/myorder/myorder"));
const adminblog = React.lazy(() => import("../view/blog/blog"));
const customer = React.lazy(() =>
  import("../view/customer-managnment/customer")
);
const addorder = React.lazy(() => import("../view/admin/myorder/addorder"));
const feedback = React.lazy(() => import("../view/feedback/feedback"));
const newsfeed = React.lazy(() => import("../view/news-feed/newsfeed"));
const Region = React.lazy(() => import("../view/region/region"));
const variant_master = React.lazy(() =>
  import("../view/admin/masters/variant_master")
);
const variant_category = React.lazy(() =>
  import("../view/admin/masters/variant_category")
);
const measurenment = React.lazy(() =>
  import("../view/admin/masters/measurenment")
);
const blog_master = React.lazy(() => import("../view/blog/blog_master"));
const UserRole = React.lazy(() => import("../view/user/userRoles"));
const tax = React.lazy(() => import("../view/admin/masters/tax"));
const Delivery = React.lazy(() => import("../view/admin/masters/Delivery"));
const addproduct = React.lazy(() => import("../view/product/addproduct"));
const editproduct = React.lazy(() => import("../view/product/editproduct"));
const viewproduct = React.lazy(() => import("../view/product/viewproduct"));
const addinventory = React.lazy(() => import("../view/inventory/addinventory"));
const adminfaq = React.lazy(() => import("../view/faq/faq"));
const adminLoyality = React.lazy(() => import("../view/referral/Loyality"));
const adminwallet = React.lazy(() => import("../view/admin/masters/wallet"));
const loyalitypoint = React.lazy(() =>
  import("../view/loyality/loyalitypoint")
);
const viewinventory = React.lazy(() =>
  import("../view/inventory/view_inventory")
);
const lostinventory = React.lazy(() =>
  import("../view/inventory/Lost_damage_listing")
);
const addlostInventory = React.lazy(() =>
  import("../view/inventory/add_Lost_damage")
);
const returndamage = React.lazy(() =>
  import("../view/inventory/return_damage_listing")
);
const addReturnDamage = React.lazy(() =>
  import("../view/inventory/add_return_damage")
);
const inhouseusage = React.lazy(() =>
  import("../view/inventory/inhouseusage_listing")
);
const add_inhouseusage = React.lazy(() =>
  import("../view/inventory/add_inhouseusage")
);
const drivermaster = React.lazy(() => import("../view/admin/masters/driver"));
const edit_inventory = React.lazy(() =>
  import("../view/inventory/edit_inventory")
);
const user_add_address = React.lazy(() =>
  import("../view/customer-managnment/Adduser_address")
);
const tenbestpro = React.lazy(() =>
  import("../view/bestselller/tenbestsellerproduct")
);
const fivebestcat = React.lazy(() =>
  import("../view/bestselller/fivebestsellercat")
);
const customerbase = React.lazy(() =>
  import("../view/bestselller/customerbased")
);

const NoMatchPage = () => {
  return (
    <>
      <img
        className="imagewidth"
        src={process.env.PUBLIC_URL + "/img/icons/404_error.png"}
        alt="404 Page Missing"
      />
    </>
  );
};

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={""}>
          <Switch>
            <Route path="/admin-login" component={Login} />
            <Route path="/admin-dashboard" component={Dashboard} />
            <Route path="/analytics-dashboard" component={AnalyticDashboard} />
            <Route path="/admin-Category" component={adminCategory} />
            <Route path="/admin-Coupon" component={Coupon} />
            <Route path="/admin-suppliers" component={suppliers} />
            <Route path="/edit-product" component={editproduct} />
            <Route path="/admin-user" component={user} />
            <Route path="/admin-orderdetails" component={orderdetails} />
            <Route path="/admin-edit-order" component={editorders} />
            <Route path="/admin-Subscription" component={subscriptiondetails} />
            <Route
              path="/admin-reportgeneration"
              component={reportgeneration}
            />
            <Route path="/admin-slides" component={slides} />
            <Route path="/admin-banners" component={banner} />
            <Route path="/product-sheet" component={ProductSheet} />
            <Route path="/dynamic-pages" component={DynamicPages} />
            <Route path="/add-dynamic-pages" component={AddDynamicPages} />
            <Route path="/edit-dynamic-pages" component={EditDynamicPages} />
            <Route path="/my-order" component={myorder} />
            <Route path="/admin-recipe" component={adminblog} />
            <Route path="/admin-customer" component={customer} />
            <Route path="/addorder" component={addorder} />
            <Route path="/admin-feedback" component={feedback} />
            <Route path="/subscribe" component={newsfeed} />
            <Route path="/variant-master" component={variant_master} />
            <Route path="/variant-category" component={variant_category} />
            <Route path="/admin-region" component={Region} />
            <Route path="/admin-measurenment" component={measurenment} />
            <Route path="/admin-recipe-category" component={blog_master} />
            <Route path="/admin-user-role" component={UserRole} />
            <Route path="/admin-tax" component={tax} />
            <Route path="/admin-delivery" component={Delivery} />
            <Route path="/add-product" component={addproduct} />
            <Route path="/admin-view-product" component={viewproduct} />
            <Route path="/admin-add-inventory" component={addinventory} />
            <Route path="/admin-view-inventory" component={viewinventory} />
            <Route path="/admin-lost-damage" component={lostinventory} />
            <Route path="/add-lost-damage" component={addlostInventory} />
            <Route path="/admin-return-inventory" component={returndamage} />
            <Route path="/add-return-damage" component={addReturnDamage} />
            <Route path="/admin-inhouse-inventory" component={inhouseusage} />
            <Route path="/add_inhouseusage" component={add_inhouseusage} />
            <Route path="/admin-driver" component={drivermaster} />
            <Route path="/ten-bestseller-products" component={tenbestpro} />
            <Route path="/five-bestseller-category" component={fivebestcat} />
            <Route path="/edit-inventory" component={edit_inventory} />
            <Route path="/customer-based-order" component={customerbase} />
            <Route path="/useraddress" component={user_add_address} />
            <Route path="/admin-general-setting" component={site_setting} />
            <Route path="/storehey" component={additional_setting} />
            <Route path="/storehey-setting" component={storehey_setting} />
            <Route path="/admin-logs" component={Logs} />
            <Route path="/Payment-keys" component={paymentApi} />
            <Route path="/sms-gateway" component={sms_gateway} />
            <Route path="/delivery-setting" component={delivery_setting} />
            <Route path="/admin-faq" component={adminfaq} />
            <Route path="/notification-settings" component={notif_setting} />
            <Route path="/email-template" component={email_temp} />
            <Route path="/admin-loyalty" component={adminLoyality} />
            <Route path="/admin-loyalty-badge" component={loyalitypoint} />
            <Route path="/admin-wallet" component={adminwallet} />
            <Route path="/admin-about" component={adminabout} />
            <Route path="/admin-privacy" component={adminprivicy} />
            <Route
              path="/admin-term_condition"
              component={admintermcondition}
            />
            <Route path="/" component={Home} exact />
            <>
              <Header history={this.props.history} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/product" component={Product_details} />
              <Route path="/product-configured" component={configure_product} />
              <Route path="/recipe" component={Blog_details} />
              <Route path="/recipe-category" component={Blog_category} />
              <Route path="/about" component={About} />
              <Route path="/terms&conditions" component={tc} />
              <Route path="/FAQ" component={faq} />
              <Route path="/Privacy-Policy" component={privicypolicy} />
              <Route path="/media-coverage" component={Media_coverage} />
              <Route path="/cart" component={Cart} />
              <Route path="/category" component={Category} />
              <Route path="/Thankyou" component={Thankyou} />
              <Route path="/Thank-you" component={addmoneythankyou} />
              <Route path="/failed" component={failed} />
              <Route path="/account" component={account} />
              <Route path="/my-profile" component={myprofile} />
              <Route path="/my-Seed" component={myseed} />
              <Route path="/my-wallet" component={mywallet} />
              <Route path="/order" component={myorders} />
              <Route path="/manage-address" component={manageaddress} />
              <Route path="/accountdetails" component={accountdetails} />
              <Route path="/contact-us" component={contactus} />
              <Route path="/sidebar" component={sidebar} />
              <Route path="/recipes" component={blog} />
              <Route path="/loyalty" component={Loyalty_static} />
              <Route path="/referral" component={Referral_static} />
              <Route path="/view/*" exact={true} component={ViewDynamicPage} />
              <Footer />
            </>

            {/* <Route path="/" component={NoMatchPage} /> */}
          </Switch>
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default Routes;
