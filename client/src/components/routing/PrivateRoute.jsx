import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from '../loading/Loading'

const PrivateRoute = ({component: Component, auth: {isAuthenticated, loading}, ...rest}) => (
   <Route {...rest} render={props => !loading ? (!isAuthenticated ? (<Redirect to='/login' />): (<Component {...props} />)): (<Loading />)} />
)

PrivateRoute.propTypes = {
auth: PropTypes.object.isRequired
}

const mapPropsToState = state => ({
auth: state.auth
})

export default connect(mapPropsToState)(PrivateRoute);