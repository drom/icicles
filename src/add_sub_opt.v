module add_sub #(
    parameter W = 16
) (
    input [W-1:0] a, b,
    input sel,
    output [W-1:0] res
);

wire ci;
wire [W:0] sum;

assign sum = {a, sel} + {(sel ? ~b : b), 1'b1};

assign res = sum[W:1];

endmodule
// Should be
// SB_LUT4 31
// SB_CARRY 16

// Yosys 112.87 MHz
// SB_LUT4 34
// SB_CARRY 16
