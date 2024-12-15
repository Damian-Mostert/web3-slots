import api from '../providers/default';
import { RULE_SERVICE } from '../config/endpoints';

interface RuleService {
    getRules: () => Promise<any>;
    updateRules: ()=> Promise<any>;
}

const ruleService: RuleService = {
    getRules: async () => {
        const resp = await api.get(RULE_SERVICE.GET_RULES);
        return resp;
    },
    updateRules: async ()=>{
        const resp = await api.get(RULE_SERVICE.UPDATE_RULES);
        return resp;
    }
};

export default ruleService;
