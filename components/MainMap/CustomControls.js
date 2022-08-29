
import { Marker } from "leaflet";
import { useMap, useMapEvents, ZoomControl } from "react-leaflet";

const CustomControls = ({ onClick }) => {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    // Call useMapEvents:
    const mapEvents = useMapEvents({
        // Use leaflet map event as the key and a call back with the 
        // map method as the value:
        zoomend: () => {
            // Get the zoom level once zoom ended:
            console.log(map.getZoom())
        },
        click: (e) => {
            // Get bounds once move has ended:
            //console.log(e)
            onClick(e.latlng);
        }
    })

    return (
        <>
            <div className="custom-controls">
                <button className="custom-controls__button" onClick={handleZoomIn}>
                    +
                </button>
                <button className="custom-controls__button" onClick={handleZoomOut}>
                    -
                </button>
            </div>
            <ZoomControl position="bottomright" />
        </>
    );
};

export default CustomControls;