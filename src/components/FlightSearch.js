import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FlightSearch.css';

const FlightSearch = () => {
  const { control, register, handleSubmit, getValues } = useForm();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showOriginInput, setShowOriginInput] = useState(false);
  const [showDestinationInput, setShowDestinationInput] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [showDurationInputs, setShowDurationInputs] = useState(false);
  const [results, setResults] = useState([]);

  const onSubmit = async () => {
    const {
      origen,
      destino,
      maxPrice,
      minDuration,
      maxDuration
    } = getValues();

    try {
      const response = await axios.get('http://localhost:8080/api/flights/search', {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          origin: showOriginInput ? origen : undefined,
          destination: showDestinationInput ? destino : undefined,
          maxPrice: showPriceInput ? maxPrice : undefined,
          minDuration: showDurationInputs ? minDuration : undefined,
          maxDuration: showDurationInputs ? maxDuration : undefined,
        },
      });

      setResults(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Buscador de Vuelos</h2>
      <div className="form-container">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="form-group">
            <label>Fecha de Inicio:</label>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => { field.onChange(date); setStartDate(date); }}
                  className="form-control mt-2"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Seleccione la fecha de inicio"
                />
              )}
            />
          </div>

          <div className="form-group mt-3">
            <label>Fecha Final:</label>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => { field.onChange(date); setEndDate(date); }}
                  className="form-control mt-2"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Seleccione la fecha final"
                />
              )}
            />
          </div>

          <h5 className="mt-4">Filtros</h5>

          {/* Checkbox para Origen */}
          <div className="form-group mt-3">
            <label>
              <input
                type="checkbox"
                onChange={(e) => setShowOriginInput(e.target.checked)}
              />{' '}
              Filtrar por Origen
            </label>
            {showOriginInput && (
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Ingrese el origen"
                {...register('origen')}
              />
            )}
          </div>

          {/* Checkbox para Destino */}
          <div className="form-group mt-3">
            <label>
              <input
                type="checkbox"
                onChange={(e) => setShowDestinationInput(e.target.checked)}
              />{' '}
              Filtrar por Destino
            </label>
            {showDestinationInput && (
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Ingrese el destino"
                {...register('destino')}
              />
            )}
          </div>

          {/* Checkbox para Precio Máximo */}
          <div className="form-group mt-3">
            <label>
              <input
                type="checkbox"
                onChange={(e) => setShowPriceInput(e.target.checked)}
              />{' '}
              Filtrar por Precio Máximo
            </label>
            {showPriceInput && (
              <input
                type="number"
                className="form-control mt-2"
                placeholder="Ingrese el precio máximo"
                {...register('maxPrice')}
              />
            )}
          </div>

          {/* Checkbox para Duración del Vuelo */}
          <div className="form-group mt-3">
            <label>
              <input
                type="checkbox"
                onChange={(e) => setShowDurationInputs(e.target.checked)}
              />{' '}
              Filtrar por Duración del Vuelo
            </label>
            {showDurationInputs && (
              <div>
                <input
                  type="number"
                  className="form-control mt-2"
                  placeholder="Duración mínima (en horas)"
                  {...register('minDuration')}
                />
                <input
                  type="number"
                  className="form-control mt-2"
                  placeholder="Duración máxima (en horas)"
                  {...register('maxDuration')}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary mt-3">Buscar</button>
        </form>

        <h3 className="mt-5">Vuelos disponibles</h3>
        {results.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              {results.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.id}</td>
                  <td>{flight.origin}</td>
                  <td>{flight.destination}</td>
                  <td>{flight.date}</td>
                  <td>{flight.price}</td>
                  <td>{flight.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron vuelos.</p>
        )}
      </div>
    </div>
  );
};

export { FlightSearch };
