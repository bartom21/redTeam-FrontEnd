
export const UPDATETHERAPY = 'UPDATETHERAPY';

export const updateRate = (data) => {
    console.log("editProfile, ", data);
    return (dispatch, getState) => {
        const id = data.id
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`
https://back-red-team.vercel.app/updateRate/${id}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                        ...data
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
                    console.log('RESPONSE', myJson);
                    dispatch({type: UPDATETHERAPY, therapy: myJson});
                })
            })
            .catch(err => console.log(err));
    };
};