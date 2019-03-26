import React from 'react'
import {withFirebase} from '../Firebase/Exports';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component { 
        constructor(props) {
            super(props);
    
            this.state = {
                authUser: null
            };
        }
        componentDidMount() {
            this.props.firebase.auth.onAuthStateChanged(authUser => {
                authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
            });
        }
        componentWillUnmount(){
            this.listener();
        }
        render(){
            return <Component {...this.props}/>
        }
    }
    return withFirebase(WithAuthentication);
}

export default withAuthentication;