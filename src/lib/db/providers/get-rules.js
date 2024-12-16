import config from "../models/config"
export default async function getRules(){
    return await config.findOne({});
}