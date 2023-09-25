<template>
    <div>
      <h2>Lista de Elementos</h2>
      <draggable v-model="elementos" @change="onDragEnd">
        <div
          v-for="(elemento, index) in elementos"
          :key="index"
          class="elemento-draggable"
        >
          {{ elemento.texto }}
        </div>
      </draggable>
    </div>
  </template>
  
  <script>
  import draggable from 'vuedraggable';
  
  export default {
    components: {
      draggable,
    },
    data() {
      return {
        elementos: [
          { texto: 'Elemento 1' },
          { texto: 'Elemento 2' },
          { texto: 'Elemento 3' },
          // ...agrega más elementos según tu necesidad
        ],
      };
    },
    methods: {
      onDragEnd() {
        // Este método se ejecutará cuando se complete el arrastre y suelte
        console.log('Se completó el arrastre y soltó');
      },
    },
  };
  </script>
  
  <style>
  .elemento-draggable {
    background-color: #e6e6e6;
    margin: 5px;
    padding: 10px;
    cursor: grab;
  }
  </style>
  