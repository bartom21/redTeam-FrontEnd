import { ADDINVOICE } from "../actions/addInvoice";
import { EDITDISCOUNT } from "../actions/editDiscount";
import { EDITINVOICE } from "../actions/editInvoice";
import { LOADDISCOUNTS } from "../actions/loadDiscounts";
import { LOADINVOICES } from "../actions/loadInvoices";
import { LOADUNPAIDSESSIONS } from "../actions/loadUnpaidSessions";
import { USERLOGOUT } from "../actions/userLogout";

const initialState = {
    unpaidSessions:[],
    invoices: [],
    discounts: []
};

export default (state = initialState, action) => {
    switch(action.type){
        case ADDINVOICE:
            return {...state, invoices: state.invoices.concat([action.invoice])};
        case EDITINVOICE:
            const updated = state.invoices.map((item) => item.id == action.invoice.id ? action.invoice : item );
            return {...state, invoices: updated};
        case EDITDISCOUNT:
            const discount = state.discounts.find(x => x.professional === action.discount.professional)
            let updated2 = []
            if(discount){
                updated2 = state.discounts.map((item) => item.professional == action.discount.professional ? action.discount : item );
            }else{
                updated2 = state.discounts.concat([action.discount])
            }
            return {...state, discounts: updated2};
        case LOADINVOICES:
            return {...state, invoices: action.invoices};
        case LOADDISCOUNTS:
            return {...state, discounts: action.discounts};
        case LOADUNPAIDSESSIONS:
            return {...state, unpaidSessions: action.unpaidSessions};
        case USERLOGOUT:
            return initialState
    }
    return state;
};