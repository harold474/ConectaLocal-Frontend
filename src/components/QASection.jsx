import React, { useState, useEffect } from "react";
import { MessageCircleQuestion, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function QASection({ itemId, userRole }) {
  const [qas, setQas] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});

  useEffect(() => {
    if (itemId) fetchQA();
  }, [itemId]);

  const fetchQA = async () => {
    try {
      const response = await fetch(`/api/productos/${itemId}/preguntas`);
      if (response.ok) {
        const data = await response.json();
        setQas(data);
      }
    } catch (error) {
      console.error("Error al cargar las preguntas", error);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/productos/${itemId}/preguntas`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ pregunta: newQuestion }),
      });

      if (response.ok) {
        setNewQuestion("");
        fetchQA();
        toast.success("Pregunta enviada");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2c3e50', marginBottom: '20px' }}>
        <MessageCircleQuestion style={{ color: '#27ae60' }} />
        Preguntas al Productor
      </h2>

      {/* Lista de preguntas */}
      <div style={{ marginBottom: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        {qas.length === 0 && <p style={{ color: '#95a5a6', fontSize: '14px' }}>Aún no hay preguntas.</p>}
        
        {qas.map((qa) => (
          <div key={qa.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #f9f9f9' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: 'bold' }}>¿? {qa.pregunta}</p>
            {qa.respuesta ? (
              <p style={{ margin: '5px 0 0 20px', fontSize: '14px', color: '#27ae60', fontWeight: 'bold' }}>
                ✓ Productor: {qa.respuesta}
              </p>
            ) : (
              userRole === 'productor' && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <input
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                    placeholder="Escribe la respuesta..."
                    onChange={(e) => setAnswerInputs({ ...answerInputs, [qa.id]: e.target.value })}
                  />
                  <button 
                    onClick={async () => {
                        const token = localStorage.getItem("token");
                        await fetch(`/api/preguntas/${qa.id}/responder`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                            body: JSON.stringify({ respuesta: answerInputs[qa.id] })
                        });
                        fetchQA();
                    }}
                    style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Enviar
                  </button>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Formulario pregunta */}
      {userRole === 'consumidor' && (
        <form onSubmit={handleAskQuestion} style={{ display: 'flex', gap: '10px' }}>
          <input
            style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Escribe tu duda..."
          />
          <button type="submit" style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
}