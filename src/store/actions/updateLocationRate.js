export const UPDATELOCATION = 'UPDATELOCATION';

export const updateLocationRate = (data , handleLoading) => {

    return (dispatch, getState) => {
        const id = Object.keys(data)[0];
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`https://back-red-team.vercel.app/updateLocationRate/${id}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                        location: data
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
                    dispatch({type: UPDATELOCATION, location: myJson});
                    if(handleLoading){handleLoading()}
                })
            })
            .catch(err => console.log(err));
    };
};