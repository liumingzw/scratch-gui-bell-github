import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class CreativeSpace extends PureComponent {
    state = {
        title: 'CreativeSpace'
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

CreativeSpace.propTypes = {
    style: PropTypes.instanceOf(Object).isRequired
};

export default CreativeSpace;
