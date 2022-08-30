import VoteSpot from "./VoteSpot";

const reducer = (records) => {
    if (records.length == 0) {
        return [];
    }
    console.log("reducer", records);
    return records.map(record => {
        switch (record.datasetid) {
            case "bureaux-vote-france-2017@public":
                return {
                    latlng: record.fields.coordonnees
                    , ...record
                };
                break;

            default:
                throw new Error("Unknown datasetid : " + item.datasetid);
                break;
        }
    });
}

const CustomSpot = ({ item }) => {
    switch (item.datasetid) {
        case "bureaux-vote-france-2017@public":
            return <VoteSpot item={item} />;
            break;

        default:
            throw new Error("Unknown datasetid : " + item.datasetid);
            break;
    }
}

export default CustomSpot;
export { reducer };