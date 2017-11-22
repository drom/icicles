module prio (
    input sa, sb, sc,
    input [7:0] a, b, c, d,
    output reg [7:0] ou
);

always @*
    if (sa)
        ou = a;
    else
        if (sb)
            ou = b;
        else
            if (sc)
                ou = c;
            else
                ou = d;


endmodule
