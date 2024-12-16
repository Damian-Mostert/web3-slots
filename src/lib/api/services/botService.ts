import api from '../providers/default';
import { BOT_SERVICE } from '../config/endpoints';

interface BotService {
    runBot: () => Promise<any>;
}

const botService: BotService = {
    runBot: async () => {
        const resp = await api.get(BOT_SERVICE.RUN_BOT);
        return resp;
    }
};

export default botService;
