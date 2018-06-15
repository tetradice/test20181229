import moveActions from './actions/move';
import appendLogActions from './actions/appendLog';

let actions = Object.assign({}, moveActions);
actions = Object.assign(actions,appendLogActions); 

export default actions;