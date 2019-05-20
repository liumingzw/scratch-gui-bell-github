import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class ControlCenter extends PureComponent {
    state = {
        title: 'ControlCenter'
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

ControlCenter.propTypes = {
    style: PropTypes.instanceOf(Object).isRequired
};

export default ControlCenter;
