import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import AppStateHOC from '../../lib/app-state-hoc.jsx';
import HashParserHOC from '../../lib/hash-parser-hoc.jsx';
import TitledHOC from '../../lib/titled-hoc.jsx';
import GUI from '../../containers/gui.jsx';

class ScratchProgram extends PureComponent {
    state = {
        title: 'ScratchProgram'
    };

    render () {
        const WrappedGui = compose(
            AppStateHOC,
            HashParserHOC,
            TitledHOC
        )(GUI);
        const { style, history} = this.props;
        const state = this.state;
        return (
            <div style={style}>
                <h1
                    onClick={() => history.goBack()}
                >{state.title}</h1>
                <WrappedGui
                    backpackVisible
                    showComingSoon
                    canSave={false}
                />
            </div>
        );
    }
}

ScratchProgram.propTypes = {
    style: PropTypes.instanceOf(Object).isRequired
};

export default ScratchProgram;
