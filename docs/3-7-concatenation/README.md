# Verilog 拼接

使用逗号分隔的拼接运算符(concatenation operator) `{` 和 `}` 可以将多位 Verilog 导线和变量组合在一起以形成更大的多位导线或变量。除了导线和变量之外，拼接运算符还允许将表达式和带位宽的常量作为操作数。

为了计算拼接后的位宽，必须知道每个操作数的位宽。

## Verilog 拼接示例

```verilog
wire 		a, b; 		// 1-bit wire
wire [1:0]  res; 		// 2-bit wire to store a and b

// res[1] follows a, and res[0] follows b
assign res = {a, b};


wire [2:0]  c;
wire [7:0] 	res1;

// res[0]   follows c[2]
// res[2:1] is always 0
// res[4:3] follows c[1:0]
// res[5]   follows a
// res[6]   follows b
assign res1 = {b, a, c[1:0], 2'b00, c[2]};
```

这是一个通过拼接输入以形成不同输出的设计示例。拼接表达式可以直接使用，或者分配给任何导线或变量，不一定是输出。

```verilog
module des (input [1:0] 	a,
            input [2:0] 	b,
            output [4:0]	out1,
            output [3:0] 	out2
           );

    assign out1 = {a, b};
    assign out2 = {a[1], 2'b01, b[2]};

endmodule

module tb;
    reg [1:0] a;
    reg [2:0] b;
    wire [4:0] out1;
    wire [3:0] out2;

    des u0 (a, b, out1, out2);

    initial begin
        a <= 0;
        b <= 0;

        $monitor("[%0t] a=%b b=%b, out1=%b out2=%b", $time, a, b, out1, out2);

        #10 a <= 3;
        #5  b <= 5;
        #10 a <= 2;
        #5  b <= 1;

        #10 $finish;
    end
endmodule
```

注意， `out2[2:1]` 始终是常数 `2'b01`。

仿真日志：

```verilog
[0]  a=00 b=000, out1=00000 out2=0010
[10] a=11 b=000, out1=11000 out2=1010
[15] a=11 b=101, out1=11101 out2=1011
[25] a=10 b=101, out1=10101 out2=1011
[30] a=10 b=001, out1=10001 out2=1010
```

## 重复运算符

当相同的表达式必须重复多次时，使用重复运算符(replication operator)，它需要一个非负常数，不能是 `x` 、`z` 或任何变量。这个常数也和原始的拼接运算符一起用大括号括起来，表示表达式将重复的总次数。

```verilog
wire a;
wire [6:0] res;

assign res = {7{a}};

{2'bz{2'b0}}         // Illegal to have Z as replication constant
{2'bx{2'b0}}         // Illegal to have X as replication constant
```

重复表达式不能出现在任何赋值的左侧，也不能连接到 `input` 或 `output` 端口。

```verilog
module des;
    reg [1:0] a;
    reg [2:0] b;

    initial begin
        a <= 2;
        b <= 4;

        #10;
        $display("a=%b b=%b res=%b", a, b, {{2{a}}, {3{b}}});
    end
endmodule
```

请注意，`a` 重复了两次，`b` 重复了三次。

```bash
a=10 b=100 res=1010100100100
```

即使常量为零，在执行重复表达式时操作数也只会被计算一次。

## 嵌套重复

允许在一般的拼接表达式中使用重复表达式。以上述示例为基础，`a` 和 `b` 已包含在总的拼接表达式中。

```verilog
module des;
    reg [1:0] a;
    reg [2:0] b;

    initial begin
        a <= 2;
        b <= 4;

        #10;
        $display("a=%b b=%b res=%b", a, b, {a, b, 3'b000, {{2{a}}, {3{b}}}});
    end
endmodule
```

仿真日志：

```bash
a=10 b=100 res=101000001010100100100
```

## 非法使用

```verilog
module des;
    reg [1:0] a;
    reg [2:0] b;
    reg [3:0] _var;

    initial begin
        a <= 2;
        b <= 4;
        _var <= 3;

        // This is illegal because variables cannot be used
        // as replication constant
        $display("a=%b b=%b res=%b", a, b, {_var{a}});
    end
endmodule
```

这会导致编译错误，如下所示。

```bash
	Top level design units:
		des
      $display("a=%b b=%b res=%b", a, b, {_var{a}});
                                             |
xmelab: *E,NOTPAR (./testbench.sv,12|45): Illegal operand for constant expression [4(IEEE)].
```





