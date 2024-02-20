
export const EDITINVOICE = 'EDITINVOICE';

export const editInvoice = (data) => {
    return (dispatch, getState) => {
        const invoiceId = data.oldInvoice.id;
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`http://localhost:8080/invoice/${invoiceId}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                        data: data
                    })
                })
                .then((response) => {
                    console.log('RESPONSE');
                    console.log(response.status);
                    if(response.status == 201 || response.status == 200){
                        console.log('Procedimiento exitoso');
                    }else{
                        console.log('Ocurrió un problema, por favor intente nuevamente.');
                    }
                    return response.json();
                })
                .then((myJson) => {
                    console.log(myJson);
                    dispatch({type:EDITINVOICE, invoice: myJson});
                })
            })
            .catch(err => console.log(err));
    };
};