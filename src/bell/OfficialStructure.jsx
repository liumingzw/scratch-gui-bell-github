import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class OfficialStructure extends PureComponent {
    state = {
        title: 'OfficialStructure'
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

OfficialStructure.propTypes = {
    style: PropTypes.instanceOf(Object).isRequired
};

export default OfficialStructure;
