# Verilog 门级示例

在上一篇文章中讨论了一些主要的内置原语，这一讲主要是看一些使用简单与门、与非门和非门的实际示例。

请注意，为了使用门编写 Verilog 代码，您必须知道如何连接元素。这与行为描述非常不同，在行为描述下，元素的选择和连接由综合工具决定。

## 例1：2x1多路复用器

模块的输出必须是 `wire` ，以便与基元(primitive)的输出端口连接。

```verilog
module mux_2x1 ( input  a, b, sel,
				 output out);
	wire sel_n;
	wire out_0;

	not (sel_n, sel);

	and (out_0, a, sel);
	and (out_1, b, sel_n);

	or (out, out_0, out_1);
endmodule
```

```verilog
module tb;
    reg a, b, sel;
    wire out;
    integer i;

    mux_2x1 u0 (.a(a), .b(b), .sel(sel), .out(out));

    initial begin
        {a, b, sel} <= 0;

        $monitor ("T=%0t a=%0b b=%0b sel=%0b out=%0b", $time, a, b, sel, out);

        for (int i = 0; i < 10; i = i+1) begin
            #1 	a <= $random;
                b <= $random;
                sel <= $random;
        end
    end
endmodule
```

仿真日志：

```verilog
T=0 a=0 b=0 sel=0 out=0
T=1 a=0 b=1 sel=1 out=0
T=2 a=1 b=1 sel=1 out=1
T=3 a=1 b=0 sel=1 out=1
T=6 a=0 b=1 sel=0 out=1
T=7 a=1 b=1 sel=0 out=1
T=8 a=1 b=0 sel=0 out=0
T=9 a=0 b=1 sel=0 out=1
T=10 a=1 b=1 sel=1 out=1
```

## 例2：全加器

```verilog
module fa (	input a, b, cin,
			output sum, cout);

	wire s1, net1, net2;

	xor (s1, a, b);
	and (net1, a, b);

	xor (sum, s1, cin);
	and (net2, s1, cin);

	xor (cout, net1, net2);
endmodule
```

```verilog
module tb;
    reg a, b, cin;
    wire sum, cout;
    integer i;

    fa u0 ( .a(a), .b(b), .cin(cin),
            .sum(sum), .cout(cout));

    initial begin
        {a, b, cin} <= 0;

        $monitor ("T=%0t a=%0b b=%0b cin=%0b cout=%0b sum=%0b",
                $time, a, b, cin, cout, sum);

        for (i = 0; i < 10; i = i+1) begin
            #1 	a <= $random;
                b <= $random;
                cin <= $random;
        end
    end
endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 cin=0 cout=0 sum=0
T=1 a=0 b=1 cin=1 cout=1 sum=0
T=2 a=1 b=1 cin=1 cout=1 sum=1
T=3 a=1 b=0 cin=1 cout=1 sum=0
T=6 a=0 b=1 cin=0 cout=0 sum=1
T=7 a=1 b=1 cin=0 cout=1 sum=0
T=8 a=1 b=0 cin=0 cout=0 sum=1
T=9 a=0 b=1 cin=0 cout=0 sum=1
T=10 a=1 b=1 cin=1 cout=1 sum=1
```

## 例3：4x2 编码器

```verilog
module enc_4x2 ( input a, b, c, d,
                output x, y);
    or (x, b, d);
    or (y, c, d);
endmodule
```

```verilog
module tb;
    reg a, b, c, d;
    wire x, y;
    integer i;

    enc_4x2 u0 ( .a(a), .b(b), .c(c), .d(d), .x(x), .y(y));

    initial begin
        {a, b, c, d} <= 0;

        $monitor("T=%0t a=%0b b=%0b c=%0b d=%0b x=%0b y=%0b",
                $time, a, b, c, d, x, y);

        for (i = 0; i <= 16; i = i+1) begin
            #1 {a, b, c, d} <= i;
        end
    end
endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 c=0 d=0 x=0 y=0
T=2 a=0 b=0 c=0 d=1 x=1 y=1
T=3 a=0 b=0 c=1 d=0 x=0 y=1
T=4 a=0 b=0 c=1 d=1 x=1 y=1
T=5 a=0 b=1 c=0 d=0 x=1 y=0
T=6 a=0 b=1 c=0 d=1 x=1 y=1
T=7 a=0 b=1 c=1 d=0 x=1 y=1
T=8 a=0 b=1 c=1 d=1 x=1 y=1
T=9 a=1 b=0 c=0 d=0 x=0 y=0
T=10 a=1 b=0 c=0 d=1 x=1 y=1
T=11 a=1 b=0 c=1 d=0 x=0 y=1
T=12 a=1 b=0 c=1 d=1 x=1 y=1
T=13 a=1 b=1 c=0 d=0 x=1 y=0
T=14 a=1 b=1 c=0 d=1 x=1 y=1
T=15 a=1 b=1 c=1 d=0 x=1 y=1
T=16 a=1 b=1 c=1 d=1 x=1 y=1
T=17 a=0 b=0 c=0 d=0 x=0 y=0
```

