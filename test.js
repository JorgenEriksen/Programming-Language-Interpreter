const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

let allTests = [
   {command: "3", expetation: "3" },
   {command: "121231324135634563456363567", expetation: "121231324135634563456363567" },
   {command: "1.0", expetation: "1.0" },
   {command: "0.0", expetation: "0.0" },
   {command: "-1", expetation: "-1" },
   {command: "-1.1", expetation: "-1.1" },
   {command: "False", expetation: "False" },
   {command: "True", expetation: "True" },

   {command: "[ [ ] [ ] ]", expetation: "[ [ ] [ ] ]" },
   {command: "[ False [ ] True [ 1 2 ] ]", expetation: "[ False [ ] True [ 1 2 ] ]" },
   {command: "[ so { not if ] and }", expetation: "[ so { not if ] and }" },
   // quotation literals
   {command: "{ 20 10 + }", expetation: "{ 20 10 + }" },
   {command: "[ { + } { 10 + } { 20 10 + } ]", expetation: "[ { + } { 10 + } { 20 10 + } ]" },

   // simple arithmetic
   {command: "1 1 +", expetation: "2" },
   {command: "10 20 *", expetation: "200"},
   {command: "20 2 div", expetation: "10"},
   {command: "20 2 /", expetation: "10.0"},

   // arithmetic with type coercion
   {command: "1 1.0 +", expetation: "2.0" },
   {command: "10 20.0 *", expetation: "200.0" },
   {command: "20 2.0 div", expetation: "10" },
   {command: "20.0 2.0 div", expetation: "10" },

   // bool operations
   {command: "False False AND", expetation: "False" },
   {command: "False True OR", expetation: "True" },
   {command: "False not", expetation: "True" },
   {command: "True not", expetation: "False" },

   // comparisons 
   {command: "20 10 lessthan", expetation: "False" },
   {command: "20 10 greaterthan", expetation: "True" },
   {command: "20 10.0 greaterthan", expetation: "True" },
   {command: "20.0 20.0 greaterthan", expetation: "False" },
   {command: "10 10 ==", expetation: "True" },
   {command: "10 10.0 ==", expetation: "True" },
   {command: "True True ==", expetation: "True" },
   {command: "True 40 40 == ==", expetation: "True" },
   {command: "\" abba \" \" abba \" ==", expetation: "True" },
   {command: "[ ] [ ] ==", expetation: "True" },
   {command: "[ 1 2 ] [ 1 2 ] ==", expetation: "True" },
   {command: " [ [ ] ] [ [ ] ] ==", expetation: "True" },

   // stack operations
   {command: "10 20 swap pop", expetation: "20" },
   {command: "10 dup dup + swap pop", expetation: "20" },
   {command: "10 20 swap dup + div", expetation: "1" },

   // stack operations
   {command: "10 20 swap pop", expetation: "20" },
   {command: "10 dup dup + swap pop", expetation: "20" },
   {command: "10 20 swap dup + div", expetation: "1" },
   
   // length
   {command: "\" hello \" length", expetation: "5" },
   {command: "\" hello world \" length", expetation: "11" },
   {command: "[ 1 2 3 [ ] ] length", expetation: "4" },
   {command: "{ 10 20 + } length", expetation: "3" },

   // String parsing
   {command: "\" 12 \" parseInteger", expetation: "12" },
   {command: "\" 12.34 \" parseFloat", expetation: "12.34" },
   {command: "\" adam bob charlie \" words", expetation: "[ \" adam \" \" bob \" \" charlie \" ]" },     
   
   //  lists
   {command: "[ 1 2 3 ]", expetation: "[ 1 2 3 ]" },
   {command: "[ 1 \" bob \" ]", expetation: "[ 1 \" bob \" ]" },
   {command: "[ 1 2 ] empty", expetation: "False" },
   {command: "[ ] empty", expetation: "True" },
   {command: "[ 1 2 3 ] head", expetation: "1" },
   {command: "[ 1 2 3 ] length", expetation: "3" },
   {command: "[ 1 2 3 ] tail", expetation: "[ 2 3 ]" },
   {command: "1 [ ] cons", expetation: "[ 1 ]" },
   {command: "1 [ 2 3 ] cons", expetation: "[ 1 2 3 ]" },
   {command: "[ 1 ] [ 2 3 ] append", expetation: "[ 1 2 3 ]" },
   {command: "[ 1 2 ] [ ] append", expetation: "[ 1 2 ]" },
   {command: "[ 1 ] [ 2 3 ] cons", expetation: "[ [ 1 ] 2 3 ]" },

   // list quotations
   {command: "[ 1 2 3 ] map { 10 * }", expetation: "[ 10 20 30 ]" },
   {command: "[ 1 2 3 ] map { 1 + }", expetation: "[ 2 3 4 ]" },
   {command: "[ 1 2 3 4 ] map { dup 2 greaterthan if { 10 * } { 2 * } }", expetation: "[ 2 4 30 40 ]" },
   {command: "[ 1 2 3 4 ] each { 10 * } + + +", expetation: "100" },
   {command: "[ 1 2 3 4 ] 0 foldl { + }", expetation: "10" },
   {command: "[ 2 5 ] 20 foldl { div }", expetation: "2" },
   // note no { } needed for 1 instruction code -}
   {command: "[ \" 1 \" \" 2 \" \" 3 \" ] each { parseInteger } [ ] cons cons cons", expetation: "[ 1 2 3 ]" },
   {command: "[ \" 1 \" \" 2 \" \" 3 \" ] each parseInteger [ ] 3 times cons", expetation: "[ 1 2 3 ]" },
   {command: "[ 1 2 3 4 ] 0 foldl +", expetation: "10" },
   {command: "[ 2 5 ] 20 foldl div", expetation: "2" },
   
   // assignments
   {command: "age", expetation: "age" },
   {command: "age 10 := age", expetation: "10" },
   {command: "10 age swap := age", expetation: "10" },
   {command: "[ 1 2 3 ] list swap := list", expetation: "[ 1 2 3 ]" },
   {command: "age 20 := [ 10 age ]", expetation: "[ 10 age ]" },

   {command: "inc { 1 + } fun 1 inc", expetation: "2" },
   {command: "mul10 { 10 * } fun inc { 1 + } fun 10 inc mul10", expetation: "110" },
   
   // quotations
   {command: "{ 20 10 + } exec", expetation: "30" },
   {command: "10 { 20 + } exec", expetation: "30" },
   {command: "10 20 { + } exec", expetation: "30" },
   {command: "{ { 10 20 + } exec } exec", expetation: "30" },
   {command: "{ { 10 20 + } exec 20 + } exec", expetation: "50" },
   
   // if
   {command: "True if { 20 } { }", expetation: "20" },
   {command: "True if { 20 10 + } { 3 }", expetation: "30" },
   {command: "10 5 5 == if { 10 + } { 100 + }", expetation: "20" },
   {command: "False if { } { 45 }", expetation: "45" },
   {command: "True if { False if { 50 } { 100 } } { 30 }", expetation: "100" },

   // if without quotation, more ergonomic expressions
   {command: "True if 20 { }", expetation: "20" },
   {command: "True if { 20 10 + } 3", expetation: "30" },
   {command: "10 10 5 5 == if + { 100 + }", expetation: "20" },
   {command: "False if { } 45", expetation: "45" },
   {command: "True if { False if 50 100 } 30", expetation: "100" },

   // times
   {command: "1 times { 100 50 + }", expetation: "150" },
   {command: "5 times { 1 } [ ] 5 times { cons } 0 foldl { + }", expetation: "5" },
   {command: "5 times 1     [ ] 5 times   cons   0 foldl   +  ", expetation: "5" },
   {command: "5 times { 10 } + + + +", expetation: "50" },
   {command: "5 times 10 4 times +", expetation: "50" },

   // loop
   {command: "1 loop { dup 4 greaterthan } { dup 1 + } [ ] 5 times { cons }", expetation: "[ 1 2 3 4 5 ]" },
   {command: "1 loop { dup 4 greaterthan } { dup 1 + } [ ] 5 times   cons  ", expetation: "[ 1 2 3 4 5 ]" },
   {command: "[ 1 ] loop { dup length 9 greaterthan }  { dup head 1 + swap cons }", expetation: "[ 10 9 8 7 6 5 4 3 2 1 ]" },


   {command: "odd { dup 2 div swap 2 / == if False True } fun 2 odd", expetation: "False" },
   
   {command: "odd { dup 2 div swap 2 / == if False True } fun 3 odd", expetation: "True" },
   
   {command: "toList { [ ] swap times cons } fun 1 2 3 4 4 toList", expetation: "[ 1 2 3 4 ]" },
   
   {command: "gen1toNum { max swap := 1 loop { dup max greaterthan } { dup 1 + } } fun 3 gen1toNum + + +", expetation: "10" },
   {command: "odd { dup 2 div swap 2 / == if False True } fun toList { [ ] swap times cons } fun gen1toNum { max swap := 1 loop { dup max biggerthan } { dup 1 + } } fun 4 gen1toNum 5 toList map odd",
   expetation: "[ True False True False True ]" }


]

let testsSucceeded = 0;
let testsFailed = 0;

allTests.forEach(async (test, idx) => {
   let res = await exec('echo ' + test.command + ' | node main.js');
   res = res.stdout;
   res = res.substr(0, res.length-2);
   if(res == test.expetation){
      // console.log("win")
      testsSucceeded++;
   } else {
      console.log("test failed: " + test.command);
      console.log("expected: " + test.expetation + ", but got: " + res);
      testsFailed++;
   }
})

