import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'

import createHistory from 'history/createMemoryHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'

export const history = createHistory()
const routingMiddleware = routerMiddleware(history)


const reducers = {
    router: routerReducer,
}

const reducer  = combineReducers(reducers)

export function initStore(initialState){
    return applyMiddleware(thunkMiddleware, routingMiddleware)(createStore)(reducer, initialState,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

}

const store = initStore()
export default store