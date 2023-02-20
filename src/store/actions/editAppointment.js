
export const EDITAPPOINTMENT = 'EDITAPPOINTMENT';
export const LOADAPPOINTMENTS = 'LOADAPPOINTMENTS';

export const editAppointment = (event) => {
    console.log("editAppointment, ", event);
    return (dispatch, getState) => {
        const appointmentId = Object.keys(event.changed)[0];
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`https://back-red-team.vercel.app:8080/session/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                    appointment: event.changed
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
                    dispatch({type:EDITAPPOINTMENT, appointment: myJson});
                })
            })
            .catch(err => console.log(err));
    };
};