module bigxor
(
  input clk,
  input [200:0] inp,
  output reg out
);

always @(posedge clk)
  out <= ^inp;

endmodule
