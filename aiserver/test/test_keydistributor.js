const KeyDistributor = require('../libs/KeyDistributor');

var serverMap = {
  s1 : { weight: 1 },
  s2 : { weight: 1 },
  s3 : { weight: 1 }
}

var kd = new KeyDistributor(serverMap);

var keys = [
"r1b1k2r%2Fpppp1ppp%2F3b4%2F2n5%2F8%2FPPq2PP1%2FR1P1KP1P%2F2B2BR1%20b%20kq%20-%200%2012",
"r1b1k2r%2Fpppp1ppp%2F3b4%2F2n5%2F8%2FPPq2PP1%2FR1P1KP1P%2F2B2BR1%20b%20kq%20-%200%2012",
"1k1r4%2Fpbpp1pp1%2F6p1%2F1K6%2F5q2%2F8%2Fr7%2F8%20b%20-%20-%201%2030",
"r1b1k2r%2Fpppp1pp1%2F2n2q2%2F4p2p%2F2PbP3%2FPQ1Pn2N%2F1P1N3P%2FR1B1KB1R%20b%20kq%20-%205%2013",
"r1b1k2r%2Fpppp1pp1%2F2n5%2F4p2p%2F2PbP2q%2FPQ1Pn2N%2F1P1NK2P%2FR1B2B1R%20b%20kq%20-%203%2012",
"r1b1k2r%2Fpppp1pp1%2F8%2F4p2p%2F2P1P2q%2FPPbP3P%2F4KN2%2F1nB4R%20b%20kq%20-%201%2023",
"r1b1k2r%2Fpppp1pp1%2F8%2F4p2p%2F2P1P2q%2FPPbPK2P%2F3n1N2%2F1RB4R%20b%20kq%20-%200%2022"
];

for (var i = 0; i < keys.length; i ++) {
  var key = keys[i];
  var serverName = kd.getServerNameForKey(key);
  console.log(serverName);
}
