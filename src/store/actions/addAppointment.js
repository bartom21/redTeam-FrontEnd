
export const ADDAPPOINTMENT = 'ADDAPPOINTMENT';
export const LOCATIONNOTAVAILABLE = 'LOCATIONNOTAVAILABLE'

export const addAppointment = (appointment) => {
    return (dispatch, getState) => {
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch('https://back-red-team.vercel.app/session', {
                    method: 'POST',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                    appointment: appointment.added
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
                    if(myJson.success){
                        dispatch({type:ADDAPPOINTMENT, appointment: myJson.appointment});
                    } else {
                        dispatch({type:LOCATIONNOTAVAILABLE, available_locations: myJson.available_locations});
                    }
                    
                })
            })
            .catch(err => console.log(err));
    };
};