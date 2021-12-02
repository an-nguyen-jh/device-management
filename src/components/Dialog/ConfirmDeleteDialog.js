import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Button } from "..";
import { confirmDialogAction, updateListAction } from "../../store/actions";
import "../styles/dialog.css";
import { IoWarningOutline } from "react-icons/io5";
import {
  deleteAllRelativeDeviceRequests,
  deleteDeviceInfoByEmail,
  deleteOldEmployeeImage,
} from "../../apiService";
import toast from "react-hot-toast";

function ConfirmDeleteDialog() {
  const { shouldDisplay, name, email, imageSrcs } = useSelector((state) => ({
    shouldDisplay: state.confirmDialog.open,
    name: state.confirmDialog.name,
    email: state.confirmDialog.email,
    imageSrcs: state.confirmDialog.imageSrcs,
  }));
  const dispatch = useDispatch();

  const handleClose = () => dispatch(confirmDialogAction.invisible());

  const deleteEmployeeDeviceImages = async (images) => {
    try {
      if (imageSrcs) {
        const imageDeletePromises = images.map((imageURL) => {
          return deleteOldEmployeeImage(imageURL);
        });
        await Promise.all(imageDeletePromises);
      }
    } catch (error) {
      //ignore error
    }
  };

  const deleteDeviceInfoAndRelativeResources = async (email) => {
    return await Promise.all([
      await deleteDeviceInfoByEmail(email),
      await deleteAllRelativeDeviceRequests(email),
      await deleteEmployeeDeviceImages(imageSrcs),
    ]);
  };

  const handleDeleteDeviceInfo = async () => {
    try {
      await deleteDeviceInfoAndRelativeResources(email);
      toast.success("Successful delete employee's device info", {
        className: "toast-notification",
      });
      handleClose();
      dispatch(updateListAction.update());
    } catch (error) {
      //ignore error
    }
  };

  return shouldDisplay ? (
    <div className="dialog-wrapper">
      <div className="dialog">
        <div className="dialog__content">
          <h3 className="grid-col-span-2"> Confirm delete</h3>
          <p className="grid-col-span-2">
            Are you sure you want to delete this device info ?
          </p>
          <p className="dialog__content__label">Employee: </p>
          <p>{name}</p>
          <p className="dialog__content__label">Email: </p>
          <p>{email}</p>
          <Alert
            className="grid-col-span-2"
            type="error"
            icon={<IoWarningOutline />}
          >
            Deleting this employee's device information will also delete all
            pending employee's device requests
          </Alert>
        </div>
        <div className="dialog__btn-group">
          <Button variant="text" onClick={handleClose}>
            CANCEL
          </Button>
          <Button
            variant="contained"
            style={{ background: "#ff0000" }}
            onClick={handleDeleteDeviceInfo}
          >
            DELETE
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
export default ConfirmDeleteDialog;