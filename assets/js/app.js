var app = new Vue({
  el: 'body',

  data: {
    messages: []
  },

  events: {
    'message:created': function (message) {
      this.messages.push(message);
    }
  },

  created: function () {
    var _this = this;

    // サーバに GET /message としてリクエストする
    io.socket.get('/message', function (res) {
      _this.messages = res;
    });

    // io.socket.on でモデルの変更イベントを監視できる
    io.socket.on('message', function (event) {
      // event.verb が変更の種類を表す
      switch (event.verb) {
        case 'created': // created: モデルに新たなデータが追加された
          _this.$emit('message:created', event.data);
          break;
      }
    });
  },

  methods: {
    create: function (event) {
      event.preventDefault(); // submit 時のページ遷移を無効にする

      var _this = this;

      // サーバに POST /message としてリクエストする
      io.socket.post('/message', this.newMessage, function (res) {
        if (res.error) {
          return console.error(res.error);
        }

        _this.$emit('message:created', res);
      });
    }
  }
});