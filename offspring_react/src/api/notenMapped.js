/**
 *  const [grades, setGrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchUserGrades();
        const gradesData = data?.ausbildung?.noten?.map(note => ({
          id: note.id,
          datum: note.datum,
          wert: note.wert,
          art: note.art,
          gewichtung: note.gewichtung,
          ausbildungsfach: note.ausbildungsfach?.name,
          lernfeld: note.lernfeld?.name,
        })) || [];
        setGrades(gradesData);
      } catch (error) {
        message.error('Fehler beim Abrufen der Noten');
      }
    };

    loadGrades();
  }, []);

 */