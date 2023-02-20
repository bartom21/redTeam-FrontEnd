export const CREATELOCATION = 'CREATELOCATION';

export const createLocation = (data , handleLoading) => {
    return (dispatch, getState) => {
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch('https://back-red-team.vercel.app:8080/createLocation', {
                    method: 'POST',
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
                    console.log(myJson);
                    dispatch({type:CREATELOCATION, location: myJson});
                    if(handleLoading){handleLoading()}
                })
            })
            .catch(err => console.log(err));
    };
};