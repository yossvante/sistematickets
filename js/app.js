// app.js
const { createApp } = Vue;

class Message {
  constructor({ nombre, email, mensaje, prioridad }) {
    this.id = Date.now() + Math.random().toString(36).slice(2,7);
    this.nombre = nombre;
    this.email = email;
    this.mensaje = mensaje;
    this.prioridad = prioridad || 'normal';
    this.fecha = new Date().toISOString();
    this.leido = false;
  }
  summary() {
    return `${this.nombre}: ${this.mensaje.slice(0,50)}...`;
  }
}

createApp({
  data() {
    return {
      form: { nombre: '', email: '', mensaje: '', prioridad: 'normal' },
      messages: JSON.parse(localStorage.getItem('msgs') || '[]'),
      errors: {},
      search: '',
      filter: 'todas'
    };
  },
  computed: {
    urgentCount() {
      return this.messages.filter(m=>m.prioridad==='alta').length;
    },
    filteredMessages() {
      let arr = this.messages.slice().sort((a,b)=> new Date(b.fecha) - new Date(a.fecha));
      if (this.filter !== 'todas') arr = arr.filter(m => m.prioridad === this.filter);
      if (this.search.trim()) {
        const q = this.search.toLowerCase();
        arr = arr.filter(m => (m.nombre + ' ' + m.email + ' ' + m.mensaje).toLowerCase().includes(q));
      }
      return arr;
    }
  },
  methods: {
    validate() {
      this.errors = {};
      if (!this.form.nombre || this.form.nombre.trim().length < 3) this.errors.nombre = 'Nombre mínimo 3 caracteres.';
      if (!this.form.email || !/^\S+@\S+\.\S+$/.test(this.form.email)) this.errors.email = 'Email inválido.';
      if (!this.form.mensaje || this.form.mensaje.trim().length < 10) this.errors.mensaje = 'Mensaje mínimo 10 caracteres.';
      return Object.keys(this.errors).length === 0;
    },
    handleSubmit() {
      // Validación (if/else demo)
      if (!this.validate()) return;
      const msg = new Message(this.form);
      // ejemplo forEach: contar palabras (demostración de estructuras de control)
      const palabras = msg.mensaje.trim().split(/\s+/).length;
      if (palabras < 3) {
        // no bloqueante, solo ejemplo de uso de switch/if
        console.log('Mensaje corto, palabras:', palabras);
      }

      this.messages.push(msg);
      this.save();
      this.resetForm();

      // Actualizar contador en header también con DOM directo (manipulación directa demostrativa)
      document.getElementById('urgentCount').textContent = this.urgentCount;
    },
    toggleRead(idx) {
      this.messages[idx].leido = !this.messages[idx].leido;
      this.save();
    },
    remove(idx) {
      // confirm para control de flujo
      if (confirm('¿Eliminar este Ticket?')) {
        this.messages.splice(idx,1);
        this.save();
      }
    },
    save() {
      localStorage.setItem('msgs', JSON.stringify(this.messages));
    },
    resetForm() {
      this.form = { nombre: '', email: '', mensaje: '', prioridad: 'normal' };
      this.errors = {};
    },
    formatDate(iso) {
      const d = new Date(iso);
      return d.toLocaleString();
    }
  },
  mounted() {
    // actualizar contador inicial
    document.getElementById('urgentCount').textContent = this.urgentCount;
  }
}).mount('#app');