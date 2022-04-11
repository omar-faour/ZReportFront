import { Store } from "pullstate";

export const storeState = new Store(null);
export const selectedStoreState = new Store(null);
export const zheaderIdState = new Store(null);
export const selectedDateState = new Store(null);

export const userState = new Store({});

export const toBeSavedState = new Store({
    headerDetails: {},
    bankDetails: [],
    payByPhoneDetails: [],
    physicalCards: [],
    physicalCash: [],
    physicalCashIn: [],
    physicalCashInNotes: [],
    physicalCashOut: [],
    physicalCashOutNotes: [],
    physicalPayByPhone: [],
    systemData: []
});

export const toBeAddedState = new Store({
    headerDetails: {},
    bankDetails: [],
    payByPhoneDetails: [],
    physicalCards: [],
    physicalCash: [],
    physicalCashIn: [],
    physicalCashInNotes: [],
    physicalCashOut: [],
    physicalCashOutNotes: [],
    physicalPayByPhone: [],
    systemData: []
});
