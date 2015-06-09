describe('addCallback', function () {  

  beforeEach(function() {
    var addOne = function() {};
    var addTwo = function() {};
    window.jarvis = new Jarvis();
    jarvis.addCallback('result', addOne, window);
    jarvis.addCallback('result', addTwo, window);
  });
  
  it('should have a function `addCallback`', function () {
    expect(jarvis.addCallback).to.be.a('function');
  });

  it('should have three added functions', function () {
    var addThree = function() {};
      //three added in test, and two at the instantiation of the jarvis
    expect(jarvis.addCallback('result', addThree, window)).to.eql(5);
  });

});

describe('addCommands', function () {  
  
  it('should have a function `addCommands`', function () {
    expect(jarvis.addCallback).to.be.a('function');
  });

  it('should have three added commands', function () {
    expect(jarvis.addCommands({addOne: function() {}})).to.eql(['addOne']);
    expect(jarvis.addCommands({addTwo: function() {}})).to.eql(['addOne','addTwo']);
    expect(jarvis.addCommands({addThree: function() {}})).to.eql(['addOne', 'addTwo', 'addThree']);
  });
   
});

