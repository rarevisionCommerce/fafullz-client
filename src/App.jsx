import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import 'animate.css'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import TestPage from './pages/TestPage'
import Register from './pages/Register'
import News from './pages/dashboard/News'
import AddFunds from './pages/dashboard/AddFunds'
import SSNDOB from './pages/dashboard/SSNDOB'
import Accounts from './pages/dashboard/Accounts'
import TextNow from './pages/dashboard/TextNow'

import GoogleVoice from './pages/dashboard/GoogleVoice'

import Files from './pages/dashboard/Files'
import MyOrders from './pages/dashboard/MyOrders'

import Cards from './pages/dashboard/Cards'
import ChangePassword from './pages/dashboard/ChangePassword'
import FAQpage from './pages/dashboard/FAQpage'
import Cart from './pages/dashboard/Cart'
import Support from './pages/dashboard/Support'
import Sell from './seller-dashboard/Sell'
import Dumps from './pages/dashboard/Dumps'
import Unauthorized from './pages/Unauthorized'
import PersistLogin from './components/PersistLogin'
import Missing from './pages/Missing'
import RequireAuth from './components/RequireAuth'
import SellerDashboard from './seller-dashboard/SellerDashboard'
import Dash from './seller-dashboard/Dash'
import MyProduct from './seller-dashboard/MyProduct'
import AdminDashboard from './admin-dashboard/AdminDashboard'
import Sellers from './admin-dashboard/Sellers'
import AdminDash from './admin-dashboard/AdminDash'
import Buyers from './admin-dashboard/Buyers'
import Refund from './admin-dashboard/Refund'
import AdminSupport from './admin-dashboard/AdminSupport'
import SellerDetails from './admin-dashboard/SellerDetails'
import Messages from './admin-dashboard/Messages'
import RegisterSeller from './pages/RegisterSeller'
import AddSeller from './pages/AddSeller'

import WithdrawRequests from './seller-dashboard/WithdrawRequests'
import WithdrawRequestAdmin from './admin-dashboard/WithdrawRequestAdmin'
import SetPrices from './admin-dashboard/SetPrices'
import EditBasePrice from './admin-dashboard/set-prices-components/EditBasePrice'
import SsnCsvUpload from './seller-dashboard/selller-Upload-forms/SsnCsvUpload'
import CardsCsvUpload from './seller-dashboard/selller-Upload-forms/CardsCsvUpload'
import MailCsvUpload from './seller-dashboard/selller-Upload-forms/MailCsvUpload'
import RefundRequestPage from './pages/dashboard/orderpages/RefundRequestPage'
import RefundDetails from './admin-dashboard/RefundDetails'
import BuyerDetails from './admin-dashboard/BuyerDetails'
import AddManager from './pages/AddManager'
import Admins from './admin-dashboard/Admins'
import AdminDetails from './admin-dashboard/AdminDetails'
import DOB from './admin-dashboard/DOB'

function App() {
  // Create a client
  const queryClient = new QueryClient()

  return (
    // routes
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerSeller" element={<RegisterSeller />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/*" element={<Missing />} />

          {/* persist login */}
          <Route element={<PersistLogin />}>
            {/* dashboard routes */}
            <Route path="/dash" element={<Dashboard />}>
              <Route
                element={
                  <RequireAuth allowedRoles={['Buyer',]} />
                }
              >
                <Route index element={<News />} />
                <Route path="addfunds" element={<AddFunds />} />
                <Route path="news" element={<News />} />
                <Route path="ssn" element={<SSNDOB />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="text-now" element={<TextNow />} />

                <Route path="change-password" element={<ChangePassword />} />
                <Route path="cards" element={<Cards />} />
                <Route path="voice" element={<GoogleVoice />} />

                <Route path="files" element={<Files />} />
                <Route path="dumps" element={<Dumps />} />
                <Route path="my-orders" element={<MyOrders />} />
                <Route path="faq" element={<FAQpage />} />
                <Route path="cart" element={<Cart />} />
                <Route path="support" element={<Support />} />
                <Route path="refund-request/:productType/:productId" element={<RefundRequestPage />} />
              </Route>

              {/* dash end.................... */}
            </Route>
            <Route
              element={
                <RequireAuth allowedRoles={[ 'Seller']} />
              }
            >
              {/* seller dash */}
              <Route path="/seller-dash" element={<SellerDashboard />}>
                <Route index element={<Dash />} />
                <Route path="dashboard" element={<Dash />} />
                <Route path="sell" element={<Sell />} />
                <Route path="my-products" element={<MyProduct />} />
                <Route path="withdrwal-request" element={<WithdrawRequests />} />
                <Route path="FAQ" element={<FAQpage />} />
                <Route path="support" element={<Support />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="ssn-csv-upload" element={<SsnCsvUpload />} />
                <Route path="card-csv-upload" element={<CardsCsvUpload />} />
                <Route path="mail-csv-upload" element={<MailCsvUpload />} />
              </Route>
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={['Admin', 'Manager']} />
              }
            >
              {/* admin dash */}
              <Route path="/admin-dash" element={<AdminDashboard />}>
                <Route index element={<AdminDash />} />
                <Route path='admindash' element={<AdminDash />} />
                <Route path="sellers" element={<Sellers />} />
                <Route path="admins" element={<Admins />} />
                <Route path="buyers" element={<Buyers />} />
                <Route path="seller-details/:userId" element={<SellerDetails />} />
                <Route path="admin-details/:userId" element={<AdminDetails />} />
                <Route path="buyer-details/:userId" element={<BuyerDetails />} />
                <Route path="messages/:jabberId" element={<Messages />} />
                <Route path="refund" element={<Refund />} />
                <Route path="supports" element={<AdminSupport />} />
            <Route path="change-pass" element={<ChangePassword />} />
            <Route path="add-seller" element={< AddSeller />} />
            <Route path="add-manager" element={< AddManager />} />

                <Route path="requests" element={<WithdrawRequestAdmin />} />
                <Route path="all-products" element={<DOB />} />
                <Route path="set-prices" element={<SetPrices />} />
                <Route path="edit-base/:baseId" element={<EditBasePrice />} />
                <Route path="refund-request/:refundId" element={<RefundDetails />} />
              </Route>
            </Route>
          </Route>
          {/* end of persist */}
        </Routes>
      </QueryClientProvider>
    </div>
  )
}

export default App
