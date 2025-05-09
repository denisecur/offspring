import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { listRichtungen } from '../../services/ausbildungsrichtungService';
import { createAusbildung } from '../../services/ausbildungService';
import { getMe } from '../../services/authService';
import { handleApiError } from '../../services/core/errorHandler';

const schema = yup.object({
  vorname: yup.string().required('Vorname ist erforderlich'),
  nachname: yup.string().required('Nachname ist erforderlich'),
  ausbildungsstart: yup
    .date()
    .required('Startdatum ist erforderlich')
    .typeError('Bitte ein gültiges Datum wählen'),
  ausbildungsrichtung: yup
    .number()
    .typeError('Bitte Ausbildungsrichtung wählen')
    .required('Bitte Ausbildungsrichtung wählen'),
});

const AusbildungSetupForm = () => {
  const { user, setUser, jwt } = useAuth();
  const navigate = useNavigate();

  const [richtungen, setRichtungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    listRichtungen()
      .then(setRichtungen)
      .catch((err) => {
        console.error('❌ Fehler beim Laden der Ausbildungsrichtungen:', err);
        setError('Fehler beim Laden der Ausbildungsrichtungen');
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values) => {
    try {
      if (!user?.id || !jwt) {
        setError('Benutzer nicht geladen. Bitte logge dich erneut ein.');
        return;
      }

      const iso = new Date(values.ausbildungsstart).toISOString().split('T')[0];

      const payload = {
        vorname: values.vorname,
        nachname: values.nachname,
        ausbildungsstart: iso,
        ausbildungsrichtung: Number(values.ausbildungsrichtung),
      };

      await createAusbildung(payload);
      const me = await getMe();
      setUser(me);
      navigate('/dashboard');
    } catch (err) {
      handleApiError(err, setError);
    }
  };

  if (loading) return <p>Lade Ausbildungsrichtungen...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Vorname" {...register('vorname')} />
      <p>{errors.vorname?.message}</p>

      <input placeholder="Nachname" {...register('nachname')} />
      <p>{errors.nachname?.message}</p>

      <input type="date" {...register('ausbildungsstart')} />
      <p>{errors.ausbildungsstart?.message}</p>

      <select {...register('ausbildungsrichtung')}>
        <option value="">Bitte wählen</option>
        {richtungen.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name || 'Unbekannt'}
          </option>
        ))}
      </select>
      <p>{errors.ausbildungsrichtung?.message}</p>

      <button type="submit">Speichern</button>
    </form>
  );
};

export default AusbildungSetupForm;
