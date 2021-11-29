import React, { useEffect, useState } from "react";
import { Toolbar, ListView, GridView, Pagination } from "..";
import { sortOptions } from "../../config/options/options";
import ENV_CONFIG from "../../config";
import { getDeviceInfos } from "../../apiService";
import toast from "react-hot-toast";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deviceInfoAction } from "../../store/actions";
import { parseSortOption } from "../../utils/parser";
import { sortDeviceInfos } from "../../utils/sort";

const tableHeaders = ["Thông tin", "Team", "Sửa đổi lần cuối", ""];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

//trigger component re render
function EmployeeDevice() {
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const dispatch = useDispatch();
  const [deviceInfos, setDeviceInfos] = useState([]);
  const { totalDeviceInfos } = useSelector((state) => ({
    totalDeviceInfos: state.deviceInfo.deviceInfos,
  }));
  const pageLimit = ENV_CONFIG.ITEM_LIMIT;
  const [isListView, setIsListView] = useState(true);
  const sortOption = query.get("sort") || sortOptions[0].key;
  const currentPage = parseInt(query.get("page")) || 1;

  const changeLayoutView = () => {
    setIsListView(!isListView);
    const deviceInfoInPage = totalDeviceInfos.slice(
      (currentPage - 1) * pageLimit,
      currentPage * pageLimit
    );
    setDeviceInfos(deviceInfoInPage);
  };

  const handleSortChange = (e) => {
    const sortTokens = parseSortOption(e.target.value, "_");
    const tempDeviceInfos = [...totalDeviceInfos];
    sortDeviceInfos(tempDeviceInfos, sortTokens);
    dispatch(deviceInfoAction.storeDeviceInfos(tempDeviceInfos));
    const deviceInfoInPage = tempDeviceInfos.slice(
      (currentPage - 1) * pageLimit,
      currentPage * pageLimit
    );
    setDeviceInfos(deviceInfoInPage);
    history.push(
      `${location.pathname}?sort=${e.target.value}&page=${currentPage}`
    );
  };

  const handlePagination = (selectedPage) => {
    const deviceInfoInPage = totalDeviceInfos.slice(
      (selectedPage - 1) * pageLimit,
      selectedPage * pageLimit
    );

    setDeviceInfos(deviceInfoInPage);
    history.push(
      `${location.pathname}?sort=${sortOption}&page=${selectedPage}`
    );
  };

  const handleDeleteDeviceInfo = (email) => {};

  useEffect(() => {
    (async () => {
      const sortTokens = parseSortOption(sortOption, "_");
      try {
        const deviceInfoSnapshots = await getDeviceInfos();
        const tempDeviceInfos = [];
        deviceInfoSnapshots.forEach((deviceInfoSnap) => {
          const temp = deviceInfoSnap.data();
          temp.updatedTime = temp.updatedTime.toDate();
          const email = deviceInfoSnap.id;
          tempDeviceInfos.push({ email, ...temp });
        });
        sortDeviceInfos(tempDeviceInfos, sortTokens);
        dispatch(deviceInfoAction.storeDeviceInfos(tempDeviceInfos));
        const deviceInfoInPage = tempDeviceInfos.slice(
          (currentPage - 1) * pageLimit,
          currentPage * pageLimit
        );
        setDeviceInfos(deviceInfoInPage);
      } catch (error) {
        console.log(error);
        toast.error("Can not get devices list of employee", {
          className: "toast-notification",
        });
      }
    })();

    //free memory in localStorage
    return dispatch(deviceInfoAction.removeDeviceInfo());
    //useEffect run once after mounting
  }, []);

  return (
    <div>
      <Toolbar
        changeLayout={changeLayoutView}
        isListView={isListView}
        sortOptions={sortOptions}
        selectOption={sortOption}
        sortHandler={handleSortChange}
      ></Toolbar>
      {isListView ? (
        <ListView
          tableHeaders={tableHeaders}
          deviceInfos={deviceInfos}
        ></ListView>
      ) : (
        <GridView deviceInfos={deviceInfos}></GridView>
      )}
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePagination}
        totalItem={totalDeviceInfos.length}
        limit={pageLimit}
      ></Pagination>
    </div>
  );
}
export default EmployeeDevice;
