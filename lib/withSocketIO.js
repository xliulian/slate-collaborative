"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * The `withSocketIO` plugin contains SocketIO layer logic.
 */
var withSocketIO = function withSocketIO(editor, options) {
  var e = editor;
  var onConnect = options.onConnect,
      onDisconnect = options.onDisconnect,
      onError = options.onError,
      connectOpts = options.connectOpts,
      url = options.url,
      autoConnect = options.autoConnect;
  /**
   * Connect to Socket.
   */

  e.connect = function () {
    if (!e.socket) {
      e.socket = (0, _socket["default"])(url, _objectSpread({}, connectOpts));
      e.socket.on('connect', function () {
        e.clientId = e.socket.id;
        e.openConnection();
        onConnect && onConnect();
      });
    }

    e.socket.on('error', function (msg) {
      onError && onError(msg);
    });
    e.socket.on('msg', function (data) {
      e.receive(data);
    });
    e.socket.on('disconnect', function () {
      e.gabageCursor();
      onDisconnect && onDisconnect();
    });
    e.socket.connect();
    return e;
  };
  /**
   * Disconnect from Socket.
   */


  e.disconnect = function () {
    e.socket.removeListener('msg');
    e.socket.close();
    e.closeConnection();
    return e;
  };
  /**
   * Receive transport msg.
   */


  e.receive = function (msg) {
    switch (msg.type) {
      case 'operation':
        return e.receiveOperation(msg.payload);

      case 'document':
        return e.receiveDocument(msg.payload);
    }
  };
  /**
   * Send message to socket.
   */


  e.send = function (msg) {
    e.socket.emit('msg', msg);
  };
  /**
   * Close socket and connection.
   */


  e.destroy = function () {
    e.socket.removeListener('disconnect');
    e.socket.close();
    e.closeConnection();
  };

  autoConnect && e.connect();
  return e;
};

var _default = withSocketIO;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93aXRoU29ja2V0SU8udHMiXSwibmFtZXMiOlsid2l0aFNvY2tldElPIiwiZWRpdG9yIiwib3B0aW9ucyIsImUiLCJvbkNvbm5lY3QiLCJvbkRpc2Nvbm5lY3QiLCJvbkVycm9yIiwiY29ubmVjdE9wdHMiLCJ1cmwiLCJhdXRvQ29ubmVjdCIsImNvbm5lY3QiLCJzb2NrZXQiLCJvbiIsImNsaWVudElkIiwiaWQiLCJvcGVuQ29ubmVjdGlvbiIsIm1zZyIsImRhdGEiLCJyZWNlaXZlIiwiZ2FiYWdlQ3Vyc29yIiwiZGlzY29ubmVjdCIsInJlbW92ZUxpc3RlbmVyIiwiY2xvc2UiLCJjbG9zZUNvbm5lY3Rpb24iLCJ0eXBlIiwicmVjZWl2ZU9wZXJhdGlvbiIsInBheWxvYWQiLCJyZWNlaXZlRG9jdW1lbnQiLCJzZW5kIiwiZW1pdCIsImRlc3Ryb3kiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7OztBQTZCQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUNuQkMsTUFEbUIsRUFFbkJDLE9BRm1CLEVBR2hCO0FBQ0gsTUFBTUMsQ0FBQyxHQUFHRixNQUFWO0FBREcsTUFJREcsU0FKQyxHQVVDRixPQVZELENBSURFLFNBSkM7QUFBQSxNQUtEQyxZQUxDLEdBVUNILE9BVkQsQ0FLREcsWUFMQztBQUFBLE1BTURDLE9BTkMsR0FVQ0osT0FWRCxDQU1ESSxPQU5DO0FBQUEsTUFPREMsV0FQQyxHQVVDTCxPQVZELENBT0RLLFdBUEM7QUFBQSxNQVFEQyxHQVJDLEdBVUNOLE9BVkQsQ0FRRE0sR0FSQztBQUFBLE1BU0RDLFdBVEMsR0FVQ1AsT0FWRCxDQVNETyxXQVRDO0FBWUg7QUFDRjtBQUNBOztBQUVFTixFQUFBQSxDQUFDLENBQUNPLE9BQUYsR0FBWSxZQUFNO0FBQ2hCLFFBQUksQ0FBQ1AsQ0FBQyxDQUFDUSxNQUFQLEVBQWU7QUFDYlIsTUFBQUEsQ0FBQyxDQUFDUSxNQUFGLEdBQVcsd0JBQUdILEdBQUgsb0JBQWFELFdBQWIsRUFBWDtBQUVBSixNQUFBQSxDQUFDLENBQUNRLE1BQUYsQ0FBU0MsRUFBVCxDQUFZLFNBQVosRUFBdUIsWUFBTTtBQUMzQlQsUUFBQUEsQ0FBQyxDQUFDVSxRQUFGLEdBQWFWLENBQUMsQ0FBQ1EsTUFBRixDQUFTRyxFQUF0QjtBQUVBWCxRQUFBQSxDQUFDLENBQUNZLGNBQUY7QUFFQVgsUUFBQUEsU0FBUyxJQUFJQSxTQUFTLEVBQXRCO0FBQ0QsT0FORDtBQU9EOztBQUVERCxJQUFBQSxDQUFDLENBQUNRLE1BQUYsQ0FBU0MsRUFBVCxDQUFZLE9BQVosRUFBcUIsVUFBQ0ksR0FBRCxFQUFpQjtBQUNwQ1YsTUFBQUEsT0FBTyxJQUFJQSxPQUFPLENBQUNVLEdBQUQsQ0FBbEI7QUFDRCxLQUZEO0FBSUFiLElBQUFBLENBQUMsQ0FBQ1EsTUFBRixDQUFTQyxFQUFULENBQVksS0FBWixFQUFtQixVQUFDSyxJQUFELEVBQXdCO0FBQ3pDZCxNQUFBQSxDQUFDLENBQUNlLE9BQUYsQ0FBVUQsSUFBVjtBQUNELEtBRkQ7QUFJQWQsSUFBQUEsQ0FBQyxDQUFDUSxNQUFGLENBQVNDLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLFlBQU07QUFDOUJULE1BQUFBLENBQUMsQ0FBQ2dCLFlBQUY7QUFFQWQsTUFBQUEsWUFBWSxJQUFJQSxZQUFZLEVBQTVCO0FBQ0QsS0FKRDtBQU1BRixJQUFBQSxDQUFDLENBQUNRLE1BQUYsQ0FBU0QsT0FBVDtBQUVBLFdBQU9QLENBQVA7QUFDRCxHQTlCRDtBQWdDQTtBQUNGO0FBQ0E7OztBQUVFQSxFQUFBQSxDQUFDLENBQUNpQixVQUFGLEdBQWUsWUFBTTtBQUNuQmpCLElBQUFBLENBQUMsQ0FBQ1EsTUFBRixDQUFTVSxjQUFULENBQXdCLEtBQXhCO0FBRUFsQixJQUFBQSxDQUFDLENBQUNRLE1BQUYsQ0FBU1csS0FBVDtBQUVBbkIsSUFBQUEsQ0FBQyxDQUFDb0IsZUFBRjtBQUVBLFdBQU9wQixDQUFQO0FBQ0QsR0FSRDtBQVVBO0FBQ0Y7QUFDQTs7O0FBRUVBLEVBQUFBLENBQUMsQ0FBQ2UsT0FBRixHQUFZLFVBQUNGLEdBQUQsRUFBdUI7QUFDakMsWUFBUUEsR0FBRyxDQUFDUSxJQUFaO0FBQ0UsV0FBSyxXQUFMO0FBQ0UsZUFBT3JCLENBQUMsQ0FBQ3NCLGdCQUFGLENBQW1CVCxHQUFHLENBQUNVLE9BQXZCLENBQVA7O0FBQ0YsV0FBSyxVQUFMO0FBQ0UsZUFBT3ZCLENBQUMsQ0FBQ3dCLGVBQUYsQ0FBa0JYLEdBQUcsQ0FBQ1UsT0FBdEIsQ0FBUDtBQUpKO0FBTUQsR0FQRDtBQVNBO0FBQ0Y7QUFDQTs7O0FBRUV2QixFQUFBQSxDQUFDLENBQUN5QixJQUFGLEdBQVMsVUFBQ1osR0FBRCxFQUF1QjtBQUM5QmIsSUFBQUEsQ0FBQyxDQUFDUSxNQUFGLENBQVNrQixJQUFULENBQWMsS0FBZCxFQUFxQmIsR0FBckI7QUFDRCxHQUZEO0FBSUE7QUFDRjtBQUNBOzs7QUFFRWIsRUFBQUEsQ0FBQyxDQUFDMkIsT0FBRixHQUFZLFlBQU07QUFDaEIzQixJQUFBQSxDQUFDLENBQUNRLE1BQUYsQ0FBU1UsY0FBVCxDQUF3QixZQUF4QjtBQUVBbEIsSUFBQUEsQ0FBQyxDQUFDUSxNQUFGLENBQVNXLEtBQVQ7QUFFQW5CLElBQUFBLENBQUMsQ0FBQ29CLGVBQUY7QUFDRCxHQU5EOztBQVFBZCxFQUFBQSxXQUFXLElBQUlOLENBQUMsQ0FBQ08sT0FBRixFQUFmO0FBRUEsU0FBT1AsQ0FBUDtBQUNELENBckdEOztlQXVHZUgsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50J1xuXG5pbXBvcnQgeyBBdXRvbWVyZ2VFZGl0b3IgfSBmcm9tICcuL2F1dG9tZXJnZS1lZGl0b3InXG5cbmltcG9ydCB7IENvbGxhYkFjdGlvbiB9IGZyb20gJ0BzbGF0ZS1jb2xsYWJvcmF0aXZlL2JyaWRnZSdcblxuZXhwb3J0IGludGVyZmFjZSBTb2NrZXRJT1BsdWdpbk9wdGlvbnMge1xuICB1cmw6IHN0cmluZ1xuICBjb25uZWN0T3B0czogU29ja2V0SU9DbGllbnQuQ29ubmVjdE9wdHNcbiAgYXV0b0Nvbm5lY3Q/OiBib29sZWFuXG5cbiAgb25Db25uZWN0PzogKCkgPT4gdm9pZFxuICBvbkRpc2Nvbm5lY3Q/OiAoKSA9PiB2b2lkXG5cbiAgb25FcnJvcj86IChtc2c6IHN0cmluZykgPT4gdm9pZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdpdGhTb2NrZXRJT0VkaXRvciB7XG4gIHNvY2tldDogU29ja2V0SU9DbGllbnQuU29ja2V0XG5cbiAgY29ubmVjdDogKCkgPT4gdm9pZFxuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkXG5cbiAgc2VuZDogKG9wOiBDb2xsYWJBY3Rpb24pID0+IHZvaWRcbiAgcmVjZWl2ZTogKG9wOiBDb2xsYWJBY3Rpb24pID0+IHZvaWRcblxuICBkZXN0cm95OiAoKSA9PiB2b2lkXG59XG5cbi8qKlxuICogVGhlIGB3aXRoU29ja2V0SU9gIHBsdWdpbiBjb250YWlucyBTb2NrZXRJTyBsYXllciBsb2dpYy5cbiAqL1xuXG5jb25zdCB3aXRoU29ja2V0SU8gPSA8VCBleHRlbmRzIEF1dG9tZXJnZUVkaXRvcj4oXG4gIGVkaXRvcjogVCxcbiAgb3B0aW9uczogU29ja2V0SU9QbHVnaW5PcHRpb25zXG4pID0+IHtcbiAgY29uc3QgZSA9IGVkaXRvciBhcyBUICYgV2l0aFNvY2tldElPRWRpdG9yXG5cbiAgY29uc3Qge1xuICAgIG9uQ29ubmVjdCxcbiAgICBvbkRpc2Nvbm5lY3QsXG4gICAgb25FcnJvcixcbiAgICBjb25uZWN0T3B0cyxcbiAgICB1cmwsXG4gICAgYXV0b0Nvbm5lY3RcbiAgfSA9IG9wdGlvbnNcblxuICAvKipcbiAgICogQ29ubmVjdCB0byBTb2NrZXQuXG4gICAqL1xuXG4gIGUuY29ubmVjdCA9ICgpID0+IHtcbiAgICBpZiAoIWUuc29ja2V0KSB7XG4gICAgICBlLnNvY2tldCA9IGlvKHVybCwgeyAuLi5jb25uZWN0T3B0cyB9KVxuXG4gICAgICBlLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgZS5jbGllbnRJZCA9IGUuc29ja2V0LmlkXG5cbiAgICAgICAgZS5vcGVuQ29ubmVjdGlvbigpXG5cbiAgICAgICAgb25Db25uZWN0ICYmIG9uQ29ubmVjdCgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGUuc29ja2V0Lm9uKCdlcnJvcicsIChtc2c6IHN0cmluZykgPT4ge1xuICAgICAgb25FcnJvciAmJiBvbkVycm9yKG1zZylcbiAgICB9KVxuXG4gICAgZS5zb2NrZXQub24oJ21zZycsIChkYXRhOiBDb2xsYWJBY3Rpb24pID0+IHtcbiAgICAgIGUucmVjZWl2ZShkYXRhKVxuICAgIH0pXG5cbiAgICBlLnNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGUuZ2FiYWdlQ3Vyc29yKClcblxuICAgICAgb25EaXNjb25uZWN0ICYmIG9uRGlzY29ubmVjdCgpXG4gICAgfSlcblxuICAgIGUuc29ja2V0LmNvbm5lY3QoKVxuXG4gICAgcmV0dXJuIGVcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0IGZyb20gU29ja2V0LlxuICAgKi9cblxuICBlLmRpc2Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgZS5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ21zZycpXG5cbiAgICBlLnNvY2tldC5jbG9zZSgpXG5cbiAgICBlLmNsb3NlQ29ubmVjdGlvbigpXG5cbiAgICByZXR1cm4gZVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY2VpdmUgdHJhbnNwb3J0IG1zZy5cbiAgICovXG5cbiAgZS5yZWNlaXZlID0gKG1zZzogQ29sbGFiQWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgICAgY2FzZSAnb3BlcmF0aW9uJzpcbiAgICAgICAgcmV0dXJuIGUucmVjZWl2ZU9wZXJhdGlvbihtc2cucGF5bG9hZClcbiAgICAgIGNhc2UgJ2RvY3VtZW50JzpcbiAgICAgICAgcmV0dXJuIGUucmVjZWl2ZURvY3VtZW50KG1zZy5wYXlsb2FkKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIG1lc3NhZ2UgdG8gc29ja2V0LlxuICAgKi9cblxuICBlLnNlbmQgPSAobXNnOiBDb2xsYWJBY3Rpb24pID0+IHtcbiAgICBlLnNvY2tldC5lbWl0KCdtc2cnLCBtc2cpXG4gIH1cblxuICAvKipcbiAgICogQ2xvc2Ugc29ja2V0IGFuZCBjb25uZWN0aW9uLlxuICAgKi9cblxuICBlLmRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgZS5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Rpc2Nvbm5lY3QnKVxuXG4gICAgZS5zb2NrZXQuY2xvc2UoKVxuXG4gICAgZS5jbG9zZUNvbm5lY3Rpb24oKVxuICB9XG5cbiAgYXV0b0Nvbm5lY3QgJiYgZS5jb25uZWN0KClcblxuICByZXR1cm4gZVxufVxuXG5leHBvcnQgZGVmYXVsdCB3aXRoU29ja2V0SU9cbiJdfQ==