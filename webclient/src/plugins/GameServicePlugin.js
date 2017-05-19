/**
 * This is a centralize service component, depends on 
 * EventBusPlugin, WebSocketFactoryPlugin
 */
import sha1 from 'sha1';
import Storage from '../libs/Storage.js';
import Chess from '../libs/chess.js';

export default class 
{
  static install(Vue) {
    Vue.prototype.$gameservice = this;

    this.$eventbus = Vue.prototype.$eventbus;
    this.$wsFactory = Vue.prototype.$wsFactory;

    this.$aiws = {};
    this.$aiws.aimoveget = this.$wsFactory.get('/ws/ai/move/get', {
      immediate_reconnect_on_close : true 
    });

    this.$aiws.aimoverecord = this.$wsFactory.get('/ws/ai/move/record', {
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

  static _doInBrowserAIMove(fen, resultHandler)
  {
    //initiate the chess ai worker only once
    if (this.chessAIWorker == undefined) {
      this.chessAIWorker = new Worker('/dist/SimpleChessAIWorker.js');
      this.chessAIWorker.addEventListener('message', (e) => {
        try {
          var data = JSON.parse(e.data);
          console.log("got a move from in-browser ai worker");
          this.game.ugly_move(data.move);  
          var result = {
            fen : this.game.fen(),
            pgn : this.game.pgn(),
            moves : this.game.moves(),
            turn : this.game.turn(),
            in_check : this.game.in_check(),
          };
          resultHandler(result);

          //let ai server record {fen, move} pair so that it actually "learn"
          this.$aiws.aimoverecord.send({
            fen : data.fen, //tricky, when saving fen, we should save the "old" fen!!!
            move : data.move
          }, (response) => {
            if (response.data && response.data.success === true) {
              console.log('ai just learned a move for this situation');
            }
          }); 
        } catch (err) {
          console.log('invalid move from in-browser ai worker');
          console.log(err);
          this.chessAIWorker.postMessage(this.game.fen()); //try asking the ai worker for a move one more time
        }
      }, false);
    }
    this.chessAIWorker.postMessage(fen);
  }

  static doAIMove(resultHandler) {
    this.$aiws.aimoveget.send({
      fen : this.game.fen()
    }, (response) => {
      var _result = response.data;
      if (_result.success) {
        try {
          var move = JSON.parse(_result.moveJSON);
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
        } catch (err) { //anything bad happens here we still fallback to in-browser ai move 
          console.log('invalid move generated from ai server, falling back to in-browser ai move');
          this._doInBrowserAIMove(this.game.fen(), resultHandler)
        }
      } else { //no valid move from ai server, fall back to in-browser ai 
        console.log('no move from ai server, fall back to in-browser ai move');
        this._doInBrowserAIMove(this.game.fen(), resultHandler)
      }
    }, (error) => { //on error, we fall back to in-browser ai
      console.log('error while getting move from ai server');
      console.log(error);
      this._doInBrowserAIMove(this.game.fen(), resultHandler)
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
