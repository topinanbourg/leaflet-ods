
import { Popup } from 'react-leaflet';

const BALSpot = ({ item }) => {
    return (
        <Popup
            position={item.latlng}
        >
            <div>
                <h2>{item.fields.lb_voie_ext}</h2>
                <p>
                    lun-ven {item.fields.hdl_semaine}<br />
                    samedi&nbsp; {item.fields.hdl_samedi}
                </p>
            </div>
        </Popup>
    );
};

const reducer = (record) => {
    return {
        latlng: record.fields.latlong,
        ...record
    };
};

export default BALSpot;
export { reducer };