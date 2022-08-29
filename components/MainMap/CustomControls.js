
import { useMapEvents, ZoomControl } from "react-leaflet";

const CustomControls = ({ onClick }) => {
    // Call useMapEvents:
    const mapEvents = useMapEvents({
        // Use leaflet map event as the key and a call back with the 
        // map method as the value:
        click: (e) => {
            // Get bounds once move has ended:
            onClick(e.latlng);
        }
    })

    return (
        <>
            <ZoomControl position="bottomright" />
        </>
    );
};

export default CustomControls;