/* NEWS2 — Taller de Desarrollo de Software Médico.
   Uso educativo. No es un dispositivo médico validado. */

const NEWS2 = {
  puntajeFR(fr) {
    if (fr <= 8) return 3;
    if (fr <= 11) return 1;
    if (fr <= 20) return 0;
    if (fr <= 24) return 2;
    return 3;
  },

  puntajeSpO2Escala1(spo2) {
    if (spo2 <= 91) return 3;
    if (spo2 <= 93) return 2;
    if (spo2 <= 95) return 1;
    return 0;
  },

  puntajeSpO2Escala2(spo2, conOxigeno) {
    if (spo2 <= 83) return 3;
    if (spo2 <= 85) return 2;
    if (spo2 <= 87) return 1;
    if (spo2 <= 92) return 0;
    if (!conOxigeno) return 0;
    if (spo2 <= 94) return 1;
    if (spo2 <= 96) return 2;
    return 3;
  },

  puntajeOxigeno(conOxigeno) {
    return conOxigeno ? 2 : 0;
  },

  puntajeTAS(tas) {
    if (tas <= 90) return 3;
    if (tas <= 100) return 2;
    if (tas <= 110) return 1;
    if (tas <= 219) return 0;
    return 3;
  },

  puntajeFC(fc) {
    if (fc <= 40) return 3;
    if (fc <= 50) return 1;
    if (fc <= 90) return 0;
    if (fc <= 110) return 1;
    if (fc <= 130) return 2;
    return 3;
  },

  puntajeConciencia(acvpu) {
    return acvpu === 'A' ? 0 : 3;
  },

  puntajeTemp(t) {
    if (t <= 35.0) return 3;
    if (t <= 36.0) return 1;
    if (t <= 38.0) return 0;
    if (t <= 39.0) return 1;
    return 2;
  },

  calcular(signos) {
    const spo2 = signos.escala2
      ? this.puntajeSpO2Escala2(signos.spo2, signos.oxigeno)
      : this.puntajeSpO2Escala1(signos.spo2);

    const detalle = {
      fr: this.puntajeFR(signos.fr),
      spo2: spo2,
      oxigeno: this.puntajeOxigeno(signos.oxigeno),
      tas: this.puntajeTAS(signos.tas),
      fc: this.puntajeFC(signos.fc),
      conciencia: this.puntajeConciencia(signos.conciencia),
      temp: this.puntajeTemp(signos.temp),
    };

    const total = Object.values(detalle).reduce((a, b) => a + b, 0);
    const hayUnTres = Object.values(detalle).some(p => p === 3);

    return { detalle, total, riesgo: this.clasificarRiesgo(total, hayUnTres) };
  },

  clasificarRiesgo(total, hayUnTres) {
    if (total >= 7) return {
      nivel: 'alto',
      etiqueta: 'Riesgo ALTO',
      respuesta: 'Respuesta de emergencia: valoración inmediata por equipo de paciente crítico. Monitoreo continuo.',
    };

    if (total >= 5) return {
      nivel: 'medio',
      etiqueta: 'Riesgo MEDIO',
      respuesta: 'Respuesta urgente: avisar al médico responsable. Signos vitales al menos cada hora.',
    };

    if (hayUnTres) return {
      nivel: 'bajo-medio',
      etiqueta: 'Riesgo BAJO-MEDIO (un parámetro en 3)',
      respuesta: 'Avisar al médico para valorar si se escala la atención. Signos vitales al menos cada hora.',
    };

    if (total >= 1) return {
      nivel: 'bajo',
      etiqueta: 'Riesgo BAJO',
      respuesta: 'Valoración por enfermería. Signos vitales al menos cada 4–6 horas.',
    };

    return {
      nivel: 'cero',
      etiqueta: 'Sin riesgo agregado (0)',
      respuesta: 'Monitoreo de rutina: signos vitales al menos cada 12 horas.',
    };
  },
};

if (typeof module !== 'undefined') module.exports = NEWS2;