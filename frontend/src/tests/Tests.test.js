import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';
import LocationDialog from "../components/locations/LocationsDialog"
import {store} from "../store/store"
import {Provider} from "react-redux";
import LocationsTable from "../components/locations/LocationsTable";

describe("LocationDialog update", () => {
    afterEach(() => {
        cleanup();
    });

    it('Should render button with the appropriate text for update', () => {
        render(<Provider store={store}><LocationDialog/></Provider>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toBeInTheDocument();
        expect(btnElement).toHaveTextContent('Rediger');
    });

    it('Should render appropriate dialog on click', () => {
        render(<Provider store={store}><LocationDialog/></Provider>);
        const btnElement = screen.getByRole('button');

        fireEvent.click(btnElement);

        const title = screen.getByText(/Opdater lokation/);
        expect(title).toBeInTheDocument();
    });

    it('Should set defaultValue on input fields', () => {
        const location = {address: 'Sofiendalsvej', zipCity: {zip: 9000, city: 'Aalborg'}}
        render(<Provider store={store}><LocationDialog location={location}/></Provider>);

        const btnElement = screen.getByRole('button');
        fireEvent.click(btnElement);

        const address = screen.getByDisplayValue(/Sofiendalsvej/);
        const zip = screen.getByDisplayValue(/900/);
        const city = screen.getByDisplayValue(/Aalborg/);

        expect(address).toBeInTheDocument();
        expect(zip).toBeInTheDocument();
        expect(city).toBeInTheDocument();
    });
});

describe("LocationDialog create", () => {
    afterEach(() => {
        cleanup();
    });

    it('Should render button with the appropriate text for create', () => {
        render(<Provider store={store}><LocationDialog action="create"/></Provider>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toBeInTheDocument();
        expect(btnElement).toHaveTextContent(/Tilføj lokation/);
    });

    it('Should render appropriate dialog on click', () => {
        render(<Provider store={store}><LocationDialog action="create"/></Provider>);
        const btnElement = screen.getByRole('button');

        fireEvent.click(btnElement);

        const title = screen.getByText(/Tilføj lokation/);
        expect(title).toBeInTheDocument();
    });
});

describe("Locations table", () => {
    afterEach(() => {
        cleanup();
    });

    it('Should render with locations', async () => {
        const locations = [{
            "id": 1,
            "zipCity": {
                "id": 1,
                "zip": 9000,
                "city": "Aalborg"
            },
            "address": "Forchhammersvej 9",
            "numbOfParkingSpaces": 50,
            "numbOfFreeParkingSpaces": 45,
            "lat": "57.03541",
            "lng": "9.91377"
        }, {
            "id": 2,
            "zipCity": {
                "id": 1,
                "zip": 9000,
                "city": "Aalborg"
            },
            "address": "Ryesgade",
            "numbOfParkingSpaces": 10,
            "numbOfFreeParkingSpaces": 10,
            "lat": "57.05382",
            "lng": "9.90303"
        }]

        render(<Provider store={store}><LocationsTable locationsRows={locations}/></Provider>);
        screen.debug
    });
});