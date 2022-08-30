
import { Popup } from 'react-leaflet';

const VoteSpot = ({ item }) => {
    return (
        <Popup
            position={item.latlng}
        >
            <div>
                <h2>{item.fields.bureau_vote}</h2>
                <p>{item.fields.nom_bureau_vote}</p>
            </div>
        </Popup>
    );
};
export default VoteSpot;