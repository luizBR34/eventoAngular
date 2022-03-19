(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["eventoAppUrl"] = "${EVENTO_APP_URL}";
  window["env"]["eventoRSUrl"] = "${EVENTO_RS_URL}";
  window["env"]["eventoASUrl"] = "${EVENTO_AS_URL}";
})(this);