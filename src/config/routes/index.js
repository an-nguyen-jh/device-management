import { lazy } from "react";
import ENV_CONFIG from "..";
import { MdOutlineDevices, MdOutlineDeviceUnknown } from "react-icons/md";

const Employee = lazy(() => import("../../pages/Employee/Employee"));
const Admin = lazy(() => import("../../pages/Admin/Admin"));
const DeviceInfoForm = lazy(() =>
  import("../../components/Form/DeviceInfoForm")
);
const DeviceRequestForm = lazy(() =>
  import("../../components/Form/DeviceRequestForm")
);

const privateRoute = {
  [ENV_CONFIG.ROLE.EMPLOYEE]: {
    pathname: "/employee",
    component: Employee,
  },
  [ENV_CONFIG.ROLE.ADMIN]: {
    pathname: "/admin",
    component: Admin,
  },
};

const employeeSubRouters = [
  {
    pathname: "/device-info",
    title: "Device's Info Form",
    icon: <MdOutlineDeviceUnknown />,
    component: DeviceInfoForm,
  },
  {
    pathname: "/device-request",
    title: "Device Request Form",
    icon: <MdOutlineDevices />,
    component: DeviceRequestForm,
  },
];

const adminSubRouters = [];

export { employeeSubRouters, adminSubRouters };

export default privateRoute;
