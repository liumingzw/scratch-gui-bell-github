import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class CableProgram extends PureComponent {
    state = {
        title: 'CableProgram'
    };

    render () {
        const style = this.props.style;
        const state = this.state;
        return (
            <div style={style}>
                <h1>{state.title}</h1>
            </div>
        );
    }
}

CableProgram.propTypes = {
    style: PropTypes.instanceOf(Object).isRequired
};

export default CableProgram;
