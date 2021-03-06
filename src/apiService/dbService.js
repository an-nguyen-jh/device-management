import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import ENV_CONFIG from "../config";

import {
  DeviceInfo,
  deviceInfoConverter,
  DeviceRequest,
  deviceRequestConverter,
} from "./customClass";

export default function generateDatabaseService() {
  const firebaseDB = getFirestore();
  const batch = writeBatch(firebaseDB);

  function getUserByEmail(email) {
    const userRef = doc(firebaseDB, "users", email);
    return getDoc(userRef);
  }

  function getDeviceInfoOfEmployeeByEmail(email) {
    const deviceInfoRef = doc(firebaseDB, "deviceInfos", email);
    return getDoc(deviceInfoRef);
  }

  function addDeviceInfoForm(data, email) {
    const deviceInfoDoc = doc(firebaseDB, "deviceInfos", email).withConverter(
      deviceInfoConverter
    );
    const deviceInfoData = new DeviceInfo(data);
    return setDoc(deviceInfoDoc, deviceInfoData, { merge: true });
  }

  function addNewRequestDevice(data) {
    const deviceRequestRef = doc(
      collection(firebaseDB, "deviceRequests")
    ).withConverter(deviceRequestConverter);
    const deviceRequestNewData = new DeviceRequest(data);
    return setDoc(deviceRequestRef, deviceRequestNewData);
  }

  function getAllDeviceInfos() {
    const deviceInfoRef = collection(firebaseDB, "deviceInfos");
    const deviceInfoQuery = query(deviceInfoRef);
    return getDocs(deviceInfoQuery);
  }

  function deleteDeviceInfoByEmail(email) {
    const deviceInfoDoc = doc(firebaseDB, "deviceInfos", email);
    return deleteDoc(deviceInfoDoc);
  }

  async function deleteAllRelativeDeviceRequests(email) {
    const deviceRequestRef = collection(firebaseDB, "deviceRequests");
    const deviceRequestQuery = query(
      deviceRequestRef,
      where("email", "==", email),
      where("status", "==", ENV_CONFIG.REQUEST.PENDING)
    );
    const pendingDeviceRequestSnaps = await getDocs(deviceRequestQuery);
    pendingDeviceRequestSnaps.forEach((deviceRequest) => {
      batch.delete(deviceRequest.ref);
    });
    await batch.commit();
  }

  function getDeviceInfoOfEmployeeById(uuid) {
    const deviceInfoRef = collection(firebaseDB, "deviceInfos");
    const deviceInfoQuery = query(deviceInfoRef, where("uuid", "==", uuid));
    return getDocs(deviceInfoQuery);
  }

  function updateEmployeeDeviceInfo(data, email) {
    const deviceInfoDoc = doc(firebaseDB, "deviceInfos", email);
    return setDoc(deviceInfoDoc, data, { merge: true });
  }

  function getDeviceRequests(status) {
    const deviceRequestRef = collection(firebaseDB, "deviceRequests");
    const deviceRequestQuery = query(
      deviceRequestRef,
      where("status", "==", status)
    );
    return getDocs(deviceRequestQuery);
  }

  function updateStatusOfDeviceRequest(requestId, status) {
    const deviceRequestDoc = doc(firebaseDB, "deviceRequests", requestId);
    return setDoc(deviceRequestDoc, { status }, { merge: true });
  }

  return {
    getUserByEmail,
    getDeviceInfoOfEmployeeByEmail,
    addDeviceInfoForm,
    addNewRequestDevice,
    getAllDeviceInfos,
    deleteDeviceInfoByEmail,
    deleteAllRelativeDeviceRequests,
    getDeviceInfoOfEmployeeById,
    updateEmployeeDeviceInfo,
    getDeviceRequests,
    updateStatusOfDeviceRequest,
  };
}
