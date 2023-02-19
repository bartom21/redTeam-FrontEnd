
export const EDITAPPOINTMENT = 'EDITAPPOINTMENT';
export const LOADAPPOINTMENTS = 'LOADAPPOINTMENTS';

export const deleteAppointment = (event) => {
    console.log("editAppointment");
    console.log(event.deleted);
    return (dispatch, getState) => {
        const appointmentId = event.deleted;
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`http://localhost:8080/deleteSession/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
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
                    dispatch({type:LOADAPPOINTMENTS, appointments: myJson.appointments});
                })
            })
            .catch(err => console.log(err));
    };
};