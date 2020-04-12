import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner'

const PrivateRoute = ({component: Component, auth: {isAuthenticated, loading}, ...rest}) => (
   <Route {...rest} render={props => !loading ? (!isAuthenticated ? (<Redirect to='/login' />): (<Component {...props} />)): (<Spinner />)} />
)

PrivateRoute.propTypes = {
auth: PropTypes.object.isRequired
}

const mapPropsToState = state => ({
auth: state.auth
})

export default connect(mapPropsToState)(PrivateRoute);