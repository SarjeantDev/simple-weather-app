import { Component } from 'react';

class Header extends Component {
    render() { 
        return (
            <header>
                <div className="wrapper headerFlexChild">
                    <h1>Check out some weather!</h1>
                    <i onClick={() => { this.props.scrollFunc() }} className="fas fa-chevron-down chevron"></i>
                </div>
            </header>
        )
    }
}
export default Header;