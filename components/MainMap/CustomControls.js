
import { useMapEvents, ZoomControl } from "react-leaflet";

const CustomControls = ({ onClick, availablesDatasets, onDatasetChange }) => {
    // Call useMapEvents:
    const mapEvents = useMapEvents({
        // Use leaflet map event as the key and a call back with the 
        // map method as the value:
        click: (e) => {
            if (e.originalEvent.target.className.indexOf("dataset-select") > -1
                || e.originalEvent.target.className.indexOf("dataset-option") > -1) {
                return;
            }
            console.log("Clicked on the map: ", e);
            // Get bounds once move has ended:
            onClick(e.latlng);
        }
    })

    const onDatasetSelect = (e) => {
        onDatasetChange(e.target.value);
    }

    return (
        <>
            <div className="leaflet-top leaflet-right">
                <select onChange={onDatasetSelect} className="leaflet-bar leaflet-control dataset-select">
                    {availablesDatasets.map(dataset => (
                        <option key={dataset.datasetid} value={dataset.datasetid} className="dataset-option">{dataset.name}</option>
                    ))}
                </select>
            </div>
            <ZoomControl position="bottomright" />
        </>
    );
};

export default CustomControls;