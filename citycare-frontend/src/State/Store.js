import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../State/AuthSlice";
import CitizenSlice from "../State/Citizen/CitizenSlice"; // <-- Import
import TechnicianSlice from "../State/Technician/TechnicianSlice"
import offtechnicianSlice from "../State/Officer/OffTechnicianSlice"
import officerSlice from "../State/Officer/OfficerSlice"
import headSlie from '../State/Head/HeadSlice';
import IssueSlice from "../State/IssueSlice"
const rootReducer = combineReducers({
  auth: authSlice,
  citizen: CitizenSlice,
  technician:TechnicianSlice,
  offtechnician:offtechnicianSlice,
  officer:officerSlice,
  head:headSlie,
  issues:IssueSlice,
})

const store = configureStore({
  reducer: rootReducer,
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);
export default store;