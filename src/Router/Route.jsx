import {
  createBrowserRouter,

} from "react-router";
import MainLayOut from "../Component/MainLayout/MainLayOut";
import Login from "../Component/Authuntication/LogIn";
import Register from "../Component/Authuntication/Register";
import Home from "../Component/Home/Home";
import MyProfile from "../DashBoard/MyProfile";
import DashBoard from "../DashBoard/DashBoard";
import TeacherRequestTable from "../Pages/Teacher/TeacherRequestTable";
import ApplyAsTeacher from "../Pages/Teacher/ApplyAsTeacher";
import AdminRoute from "../Hooks/AdminRoute";
import AllUsersTable from "../Admin/AllUsersTable";
import AddClass from "../Pages/Teacher/AddClass";
import AllClass from "../Pages/Class/AllClass for teacher";
import MyClass from "../Pages/Teacher/MyClasses";
import UpdateClass from "../Pages/Teacher/UpdateClass";
import ClassesTable from "../Pages/Teacher/ClassesTable";
import ClassDetails from "../Pages/Class/ClassDetails";
import PrivetRouter from "../Provider/PrivateRoute";
import StripeCheckoutPage from "../Component/Payment/StripeCheckoutPage";
import MyEnrollments from "../Component/Student/MyEnrollments";
import PaymentHistory from "../Component/Payment/PaymentHistory";
import MyEnrollClassDetails from "../../MyEnrollClassDetails";
import ClassDetailsForTeacher from "../Pages/Teacher/ClassDetailsForTeacher";
import AboutUs from "../Component/Home/AboutUs";
import ContactUs from "../Component/Home/contactUs";
import AllPaymentsChart from "../Admin/Overview";
import Overview from "../Admin/Overview";




export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayOut,
    children: [
      {
        index: true,
        Component: Home,
        loader: () => fetch('/carousel.json')
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      },
      {
        path: "myProfile",
        Component: MyProfile
      },
      {
        path: "teacher",
        element: <PrivetRouter>
          <ApplyAsTeacher></ApplyAsTeacher>
        </PrivetRouter>

      },
      {
        path: "allClass",
        Component: AllClass
      },
      {
        path: "class/:id/details",
        element: <PrivetRouter>
          <ClassDetails></ClassDetails>
        </PrivetRouter>

      },
      {
        path: "/class/:id/checkout",
        Component: StripeCheckoutPage // where you mount CheckoutForm
      },

      {
        path:"aboutUs",
        Component:AboutUs
      },
      {
        path:"contactUs",
        Component:ContactUs
      }

    ]
  },
  {
    path: "dashboard",
    Component: DashBoard,
    children: [
      {
        path: "Admin/TeacherRequestTable",
        element: <PrivetRouter>
          <AdminRoute>
            <TeacherRequestTable></TeacherRequestTable>
          </AdminRoute>
        </PrivetRouter>

      },
      {
        path: "myProfile",
        Component: MyProfile
      },
      {
        path: "allPaymentsChart",
        Component:Overview
      },
      {
        path: "/dashboard/PaymentHistory",
        Component: PaymentHistory
      },
      {
        path: "allUserTable",
        element: <PrivetRouter>
          <AllUsersTable></AllUsersTable>
        </PrivetRouter>
      },
      {
        path: "addClass",
        element: <PrivetRouter>
          <AddClass></AddClass>
        </PrivetRouter>
      },
      {
        path: "myClass",
        element: <PrivetRouter>
          <MyClass></MyClass>
        </PrivetRouter>
      },
      {
        path: '/dashboard/my-class/:id',
        Component: UpdateClass
      },
      {
        path: "classTable",
        Component: ClassesTable
      },
      {
        path: "/dashboard/my-enroll",
        Component: MyEnrollments
      },
      {
        path: "/dashboard/my-class-details/:id",
        Component: ClassDetailsForTeacher
      }
    ]
  }
]);