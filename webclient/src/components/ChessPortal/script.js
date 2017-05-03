export default {
  components : {
    'chessboard' : require('ChessBoard/component.vue'),
    'chess-status' : require('ChessStatus/component.vue'),
    'chess-controlpanel' : require('ChessControlPanel/component.vue'),
    'saved-games' : require('SavedGames/component.vue'),
  },

  data () {
    return {
      'welcome_message' : 'Welcome to the chess game!',
    }
  },
}
