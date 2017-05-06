/**
 * This is a centralize service component, depends on 
 * EventBusPlugin, WebSocketFactoryPlugin
 */
import sha1 from 'sha1';
import Storage from '../libs/Storage.js';
import SimpleChessAI from '../../../isomorphic/libs/SimpleChessAI.js';
import Chess from '../../../isomorphic/libs/chess.js';

export default class 
{
  static install(Vue) {
    Vue.prototype.$gameservice = this;

    this.$eventbus = Vue.prototype.$eventbus;
    this.$wsFactory = Vue.prototype.$wsFactory;

    this.$aiws = {};
    this.$aiws.aimoveget = this.$wsFactory.get('/ws/ai/move/get', {
      keep_alive : false,
      immediate_reconnect_on_close : true 
    });

    this.$eventbus.$on('game_pgn_update', (pgn) => {
      var currentGameData = Storage.getItem('current_game_data');
      currentGameData.pgn = pgn;
    });
  }

  static createNewGame(gameOptions) {
    var gameId = sha1(Date.now() + window.navigator.userAgent).substring(0,16);
    var gameData = {
      gameId : gameId,
      playerColor : gameOptions.player_color,
      pgn : '',
    }
    Storage.setItem('current_game_data', gameData);
    this.game = new Chess();

    var result = {
      game_id : gameId,
      moves : this.game.moves(),
      pgn : this.game.pgn(),
      fen : this.game.fen(),
      player_color : gameOptions.player_color
    }

    return result;
  }

  static saveCurrentGame()
  {
    var currentGameData = Storage.getItem('current_game_data');
    var currentGameId = currentGameData.gameId;
    var savedGameData = Storage.getItem('saved_game_data');

    if (savedGameData == null) {
      savedGameData = {};
    }

    savedGameData[currentGameId] = {
      gameId : currentGameId,
      pgn : currentGameData.pgn,
      playerColor : currentGameData.playerColor
    };

    Storage.setItem('saved_game_data', savedGameData);
  }

  static loadGame(gameId) {
    var savedGameData = Storage.getItem('saved_game_data');
    Storage.setItem('current_game_data', savedGameData[gameId]);
    this.game.load_pgn(savedGameData[gameId].pgn);

    var result = {
      game_id : gameId,
      moves : this.game.moves(),
      pgn : savedGameData[gameId].pgn,
      fen : this.game.fen(),
      player_color : savedGameData[gameId].playerColor
    }

    return result;
  }

  static getSavedGames() 
  {
    var savedGameData = Storage.getItem('saved_game_data');
    return savedGameData;
  }

  static _doInBrowserAIMove(fen)
  {
    var move = SimpleChessAI.getNextBestMove(fen); //we just get the next best move based on the current fen string
    this.game.ugly_move(move);  
    var result = {
      fen : this.game.fen(),
      pgn : this.game.pgn(),
      moves : this.game.moves(),
      turn : this.game.turn(),
      in_check : this.game.in_check(),
    };
    return result;
  }

  static doAIMove(resultHandler) {
    var fen = this.game.fen();

    this.$aiws.aimoveget.sendMessage(fen, (response) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        const text = e.srcElement.result;
        var move = JSON.parse(text);
        console.log(move);
        if (typeof move == 'object') {
          console.log('got move from ai server');
          this.game.ugly_move(move);
          var result = {
            fen : this.game.fen(),
            pgn : this.game.pgn(),
            moves : this.game.moves(),
            turn : this.game.turn(),
            in_check : this.game.in_check(),
          };
          resultHandler(result);
        } else { //no valid move from ai server, fall back to in-browser ai 
          resultHandler(this._doInBrowserAIMove(fen));
        }
      });
      if (typeof response.data == 'object') {
        reader.readAsText(response.data);
      } else {
        resultHandler(this._doInBrowserAIMove(fen));
      }
    }, (error) => { //on error, we fall back to in-browser ai
      console.log(error);
      resultHandler(this._doInBrowserAIMove(fen));
    }); 

  }

  static doPlayerMove(source, target)
  {
    var move = this.game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    return {
      fen : this.game.fen(),
      pgn : this.game.pgn(),
      moves : this.game.moves(),
      turn : this.game.turn(),
      in_check : this.game.in_check(),
      is_valid_move : (move != null)
    };
  }
}
