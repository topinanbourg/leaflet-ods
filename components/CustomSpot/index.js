import BALSpot, { reducer as BALReducer } from "./BALSpot";
import VoteSpot, { reducer as VoteReducer } from "./VoteSpot";

const reducer = (records) => {
    if (records.length == 0) {
        return [];
    }
    return records.map(record => {
        switch (record.datasetid) {
            case "bureaux-vote-france-2017@public":
                return VoteReducer(record);
                break;
            case "laposte_boiterue@datanova":
                return BALReducer(record);
                break;

            default:
                throw new Error("Unknown datasetid : " + record.datasetid);
                break;
        }
    });
}

const CustomSpot = ({ item }) => {
    switch (item.datasetid) {
        case "bureaux-vote-france-2017@public":
            return <VoteSpot item={item} />;
            break;
        case "laposte_boiterue@datanova":
            return <BALSpot item={item} />;
            break;

        default:
            throw new Error("Unknown datasetid : " + item.datasetid);
            break;
    }
}

export default CustomSpot;
export { reducer };