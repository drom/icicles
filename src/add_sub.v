module add_sub #(
    parameter W = 16
) (
    input [W-1:0] a, b,
    input sel,
    output [W-1:0] res
);

assign res = sel
  ? (a - b)
  : (a + b);

endmodule
// Should be
// SB_LUT4 31
// SB_CARRY 15

// Yosys 94.66 MHz
// SB_LUT4 66
// SB_CARRY 30
