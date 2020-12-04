// Header class component
import { Component } from 'react';
import './App.css';

class Header extends Component {
    render() { 
        return (
            <header>
                <div className="wrapper headerFlexChild">
                    <h1>Check out some weather!</h1>
                    {/* Header gets passed a function to scroll the user to the form when chevron down is clicked  */}
                    <i onClick={() => { this.props.scrollFunc() }} className="fas fa-chevron-down chevron"></i>
                </div>
            </header>
        )
    }
}

export default Header;