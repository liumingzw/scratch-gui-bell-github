import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class AdvancedClassroom extends PureComponent {
    state = {
        title: 'AdvancedClassroom'
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

AdvancedClassroom.propTypes = {
    style: PropTypes.instanceOf(Object).isRequired
};

export default AdvancedClassroom;
