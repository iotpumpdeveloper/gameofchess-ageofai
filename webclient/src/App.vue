<template src="./App.html">
</template>

<script>
  import ChessPortal from './components/ChessPortal/component.vue';

  document.title = "Welcome to Game of Chess!";

  export default {
    components : { //register component locally, see document: https://vuejs.org/v2/guide/components.html#Component-Naming-Conventions
      ChessPortal //by loading component this way, in the template later, we can use tag name like <chess-portal></chess-portal>
    }
  }

  </script>
