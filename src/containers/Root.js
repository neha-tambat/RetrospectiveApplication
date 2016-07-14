import React from 'react';
import {Provider} from 'react-redux';
import routes from '../routes';
import {ReduxRouter} from 'redux-router';
import Main from '../view/Main';

import configureStore from '../store/configureStore';
const store = configureStore();

export default class Root extends React.Component {

    static propTypes : {
        store: React.PropTypes.object.isRequired
    };

    render () {
        return (
            <div>
                <Provider store={store}>
                    <div>
                        <ReduxRouter>
                            {routes}
                        </ReduxRouter>
                    </div>
                </Provider>
            </div>
        );

    }
}
