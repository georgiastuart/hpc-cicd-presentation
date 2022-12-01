module.exports = function (registry) {
  registry.docinfoProcessor(function () {
    var self = this
    self.atLocation('head')
    self.process(function () {
      return '<script type="text/javascript" src="assets/d3/dist/d3.min.js"></script>\n'
    })
  })
  registry.docinfoProcessor(function () {
    var self = this
    self.atLocation('footer')
    self.process(function () {
      return '<script type="text/javascript" src="reveal.js/plugin/math/math.js"></script>\n \
      <script defer>Reveal.registerPlugin( RevealMath.MathJax3 )</script>\n \
      <script>MathJax = { \
        startup: { \
          pageReady: async function() { \
            console.log("here"); \
            await MathJax.startup.defaultPageReady(); \
            setupEqns(); \
          } \
        }\
      }</script>'
    })
  })
}