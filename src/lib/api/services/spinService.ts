import api from '../providers/default';
import { SPIN_SERVICE } from '../config/endpoints';

interface SpinService {
    handleSpin: () => Promise<any>;
    getSpins: () => Promise<any>
}

const spinService: SpinService = {
    handleSpin: async () => {
        const resp = await api.post(SPIN_SERVICE.HANDLE_SPIN);
        return resp;
    },
    getSpins: async() =>{
        const resp = await api.post(SPIN_SERVICE.GET_SPINS);
        return resp;
    }
};

export default spinService;
