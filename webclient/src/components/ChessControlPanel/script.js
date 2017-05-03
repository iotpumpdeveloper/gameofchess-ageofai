export default {

  components : {
    'modal-player-color-chooser' : require('vue2-flexible-modal')    
  },

  data () {
    return {
      modal:{
        title:'Welcome to the chess game',
        visible:false,
        text:'',
      },
      player_color : 'white', //default player color is white
    }
  },

  methods : {
    startNewGame () {
      this.modal.visible = !this.modal.visible;
    },

    saveCurrentGame () {
      this.$gameservice.saveCurrentGame();

      this.$eventbus.$emit('game_saved');
    },

    MODAL_OK_EVENT(){
      // you can set modal show or hide with the variable 'this.modal.visible' manually 
      this.modal.visible = false; 
      this.$eventbus.$emit('new_game_started', {
        player_color : this.player_color
      });
    },
    MODAL_CANCEL_EVENT(){

    }
  },

  mounted () {
    this.startNewGame();
  }
}
