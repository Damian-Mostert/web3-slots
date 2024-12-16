import api from '../providers/default';
import { SPIN_SERVICE } from '../config/endpoints';

interface SpinService {
    handleSpin: () => Promise<any>;
    getInfo: () => Promise<any>
}

const spinService: SpinService = {
    handleSpin: async () => {
        const resp = await api.post(SPIN_SERVICE.HANDLE_SPIN);
        return resp;
    },
    getInfo: async() =>{
        const resp = await api.get(SPIN_SERVICE.GET_INFO);
        return resp;
    }
};

export default spinService;
