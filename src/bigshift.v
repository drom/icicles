module bigshift (clk, inp, out);

parameter BITS = 7500;

input clk;
input inp;
output out;

reg [BITS-1:0] r;

always @(posedge clk)
    r <= {r[BITS-2:0], inp};

assign out = r[BITS-1];

endmodule
