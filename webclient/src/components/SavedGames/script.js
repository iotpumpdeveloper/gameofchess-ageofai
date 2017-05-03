export default {
  data () {
    return {
      'saved_game_list' : []
    }
  },

  methods : {
    loadGameIntoBoard(gameId) {
      var result = this.$gameservice.loadGame(gameId);
      this.$eventbus.$emit('load_saved_game', result);
    }
  },

  mounted () {
    this.$eventbus.$on('game_saved', () => {
      var savedGameData = this.$gameservice.getSavedGames();
      this.saved_game_list = Object.keys(savedGameData).reverse(); 
    });
  }
}
