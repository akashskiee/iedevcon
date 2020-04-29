import axios from 'axios';
import {setAlert} from './alert';
import {GET_PROFILE, UPDATE_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, ACCOUNT_DELETED} from './types';


//Get current user's profile

export const getCurrentProfile = () => async dispatch => {
    try {
        const res  = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response, status: err.resopnse }
        });
    }
};


//Create or Update profile

export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {
        const config = {
            headers : {
                'Content-Type' : 'application/json'
            }
        };

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        if(!edit){
            history.push('/dashboard')
        }

    } catch (err) {
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.resopnse, status: err.response}
        });
    }
};

//Add experience

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers : {
                'Content-Type' : 'application/json'
            }
        };

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience added!', 'success'));
        history.push('/dashboard')

    } catch (err) {
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.resopnse, status: err.response}
        });
    }
};

//Add education

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers : {
                'Content-Type' : 'application/json'
            }
        };

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education added!', 'success'));
        history.push('/dashboard')

    } catch (err) {
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.resopnse, status: err.response}
        });
    }
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience removed!', 'success'));
    } catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.resopnse, status: err.response}
        });
    }
};

// Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education removed!', 'success'));
    } catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.resopnse, status: err.response}
        });
    }
};

// Delete Account and profile
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure? This can not be undone!'));
    try {
        const res = await axios.delete(`/api/profile`);
        dispatch({type: CLEAR_PROFILE});
        dispatch({type: ACCOUNT_DELETED});
        dispatch(setAlert('Your account has been permanantly deleted'));
    } catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.resopnse, status: err.response}
        });
    }
};